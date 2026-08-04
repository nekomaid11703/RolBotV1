/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "warn",
      comment: "Circular dependencies increase coupling and make codebase harder to evolve.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment: "Orphan files are not imported from anywhere.",
      from: { orphan: true },
      to: {},
    },
    {
      name: "no-deprecated-core",
      comment: "A module depends on a deprecated Node.js core module.",
      severity: "warn",
      from: {},
      to: { dependencyTypes: ["deprecated"] },
    },
    {
      name: "commands-not-to-core",
      comment: "Commands should not directly import from core modules.",
      severity: "error",
      from: { path: "^src/commands/" },
      to: {
        path: "^src/core/",
        dependencyTypesNot: ["local"],
      },
    },
    {
      name: "utils-not-to-services",
      comment: "Utils should not import from services (inversion).",
      severity: "warn",
      from: { path: "^src/utils/" },
      to: { path: "^src/services/" },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: ["node_modules", "graphify-out", "logs", "bugs", "_archive", "ai-memory"],
    },
    includeOnly: "^src",
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node"],
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
      },
      archi: {
        collapsePattern: "src/(utils|services|core|commands|database)/",
      },
    },
  },
};
