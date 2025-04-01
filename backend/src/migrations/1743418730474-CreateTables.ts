import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1743418730474 implements MigrationInterface {
    name = 'CreateTables1743418730474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deployment" ("id" SERIAL NOT NULL, "containerName" character varying NOT NULL, "image" character varying NOT NULL, "port" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'running', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_ee1f952fc81f37c6fea69c2e248" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('developer', 'team_lead', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'developer', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deployment" ADD CONSTRAINT "FK_7b758b193eb4f7956ca3cf472cc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployment" DROP CONSTRAINT "FK_7b758b193eb4f7956ca3cf472cc"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "deployment"`);
    }

}
