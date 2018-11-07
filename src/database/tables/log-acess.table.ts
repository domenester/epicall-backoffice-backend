import { Client } from "pg";
import * as sequelize from "sequelize";
import { Sequelize, Model as sequelizeModel } from "sequelize";
import { LOG_ACCESS, LOG_CALL, LOG_CONFERENCE } from "./config";
import { errorGenerator } from "../../components/error";
import { logAccessQuery } from "./test/queries.spec";
import { ITableHandler }  from "../../interfaces";

export class LogAccess implements ITableHandler{

  sequelize: Sequelize;
  model: sequelize.Model<string, {}>;

  constructor(sequelize: Sequelize){
    this.sequelize = sequelize;
  }

  initialize() {

    const { fields } = LOG_ACCESS;

    this.model = this.sequelize.define(LOG_ACCESS.name, {
      [fields.id.value]: {
        type: sequelize.UUID,
        primaryKey: fields.id.primaryKey,
      },
      [fields.userId.value]: {
        type: sequelize.UUID,
        allowNull: false
      },
      [fields.createdAt.value]: {
        type: sequelize.DATE,
        allowNull: false
      },
      [fields.isLogoff.value]: {
        type: sequelize.BOOLEAN,
        allowNull: false
      }
    }, { 
      freezeTableName: true,
      timestamps:false
    });
  }

  async createMocks() {
    const operation = await logAccessQuery(this.model);
    return operation;
  }

  async drop() {
    const operation = await this.model.drop().catch(err => err);
    return operation;
  }
}

export const LogAccessInstance = (sequelize: Sequelize) => {
  const logAccess = new LogAccess(sequelize);
  logAccess.initialize();
  return logAccess;
}
