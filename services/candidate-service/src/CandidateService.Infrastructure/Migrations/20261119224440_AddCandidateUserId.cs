using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CandidateService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCandidateUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Candidates",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Candidates_UserId",
                table: "Candidates",
                column: "UserId",
                unique: true,
                filter: "\"UserId\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Candidates_UserId",
                table: "Candidates");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Candidates");
        }
    }
}
