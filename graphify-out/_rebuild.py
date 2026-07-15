import json
from graphify.extract import collect_files, extract
from pathlib import Path
import sys

detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
code_files = []
for f in detect.get('files', {}).get('code', []):
    code_files.extend(collect_files(Path(f)) if Path(f).is_dir() else [Path(f)])

if code_files:
    result = extract(code_files, cache_root=Path('.'))
    Path('graphify-out/.graphify_ast.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f'AST: {len(result["nodes"])} nodes, {len(result["edges"])} edges')
else:
    print('No code files - skipping AST extraction')
    sys.exit(0)

# Build graph from extraction
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json

extraction = json.loads(Path('graphify-out/.graphify_extract.json').read_text(encoding='utf-8')) if Path('graphify-out/.graphify_extract.json').exists() else None

if extraction:
    G = build_from_json(extraction, root='.', directed=False)
else:
    sem = json.loads(Path('graphify-out/.graphify_semantic.json').read_text(encoding='utf-8'))
    merged = {
        'nodes': result['nodes'] + sem.get('nodes', []),
        'edges': result['edges'] + sem.get('edges', []),
        'hyperedges': sem.get('hyperedges', []),
    }
    G = build_from_json(merged, root='.', directed=False)

print(f'Built graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges')

if G.number_of_nodes() == 0:
    print('ERROR: Graph is empty')
    sys.exit(1)

communities = cluster(G)
cohesion = score_all(G, communities)
gods = god_nodes(G)
surprises = surprising_connections(G, communities)

merged_output = {
    'nodes': [{'id': n, **G.nodes[n]} for n in G.nodes()],
    'edges': [{'source': u, 'target': v, **G.edges[u, v]} for u, v in G.edges()],
    'hyperedges': [],
}
Path('graphify-out/graph.json').write_text(json.dumps(merged_output, indent=2, ensure_ascii=False), encoding='utf-8')

print(f'Graph written: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities')
print(f'God nodes: {gods[:5]}')
