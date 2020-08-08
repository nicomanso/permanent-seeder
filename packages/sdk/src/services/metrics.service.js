const { Config } = require('../mixins/config.mixin')
const { MetricsDatabase } = require('@geut/permanent-seeder-database')

module.exports = {
  name: 'metrics',

  mixins: [Config],

  dependencies: [
    'metricsdb'
  ],

  events: {
    'seeder.stats': {
      async handler (ctx) {
        await this.database.add(ctx.params)
      }
    }
  },

  actions: {
    get: {
      params: {
        key: { type: 'string', length: '64', hex: true },
        timestamp: { type: 'number', optional: true }
      },
      async handler (ctx) {
        return this.database.filterByTimestamp(ctx.params.key)
      }
    },
    getAll: {
      async handler () {
        return this.database.getAll()
      }
    }
  },

  methods: {
  },

  created () {
    this.config = {
      ...this.seetings.config.metrics.db
    }

    this.database = new MetricsDatabase(this.config.path)
  },

  async stopped () {
    await this.database.close()
  }

}
