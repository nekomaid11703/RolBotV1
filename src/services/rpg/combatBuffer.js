class CombatBuffer {
  constructor(ctx) {
    this.inputText = ctx.text;
    this.room = ctx.room;
    this.participant = ctx.participant;
    this.inventory = ctx.inventory;
    this.status = 'pending';

    this.classification = null;
    this.mechanics = null;
    this.infractions = [];
    this.coherent = true;
    this.coherenceIssues = [];
    this.environmentalEffect = null;
    this.abilityId = null;
    this.abilityResult = null;
    this.actionResult = null;
    this.narrative = null;
    this.tone = null;

    this.errors = [];
    this.modelsUsed = {};
  }
}

module.exports = { CombatBuffer };
