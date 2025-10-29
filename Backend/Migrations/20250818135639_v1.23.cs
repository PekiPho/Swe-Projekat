using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class v123 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AlterColumn<string>(
        name: "Name",
        table: "Roles",
        type: "nvarchar(450)",
        nullable: false,
        oldClrType: typeof(string),
        oldType: "nvarchar(max)");

        migrationBuilder.Sql(@"
            IF NOT EXISTS (SELECT name 
                        FROM sys.indexes 
                        WHERE name = 'IX_Roles_Name' 
                            AND object_id = OBJECT_ID('Roles'))
            BEGIN
                CREATE UNIQUE INDEX [IX_Roles_Name] ON [Roles] ([Name])
            END
        ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Roles_Name",
                table: "Roles");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
