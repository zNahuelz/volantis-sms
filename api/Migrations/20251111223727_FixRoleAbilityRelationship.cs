using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class FixRoleAbilityRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoleAbilities_Abilities_AbilityId1",
                table: "RoleAbilities");

            migrationBuilder.DropIndex(
                name: "IX_RoleAbilities_AbilityId1",
                table: "RoleAbilities");

            migrationBuilder.DropColumn(
                name: "AbilityId1",
                table: "RoleAbilities");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AbilityId1",
                table: "RoleAbilities",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoleAbilities_AbilityId1",
                table: "RoleAbilities",
                column: "AbilityId1");

            migrationBuilder.AddForeignKey(
                name: "FK_RoleAbilities_Abilities_AbilityId1",
                table: "RoleAbilities",
                column: "AbilityId1",
                principalTable: "Abilities",
                principalColumn: "Id");
        }
    }
}
