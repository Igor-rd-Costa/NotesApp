﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using webapi.Data;

#nullable disable

namespace webapi.Migrations
{
    [DbContext(typeof(NotesAppContext))]
    [Migration("20240211203725_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("webapi.Models.Note", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("ModifyDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("notes");
                });

            modelBuilder.Entity("webapi.Models.NoteDefaultSettings", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("BackgroundColor")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("character varying(9)");

                    b.Property<decimal>("MarginBottom")
                        .HasColumnType("numeric");

                    b.Property<string>("MarginFormat")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("MarginLeft")
                        .HasColumnType("numeric");

                    b.Property<decimal>("MarginRight")
                        .HasColumnType("numeric");

                    b.Property<decimal>("MarginTop")
                        .HasColumnType("numeric");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("note_default_settings");
                });

            modelBuilder.Entity("webapi.Models.NoteSettings", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("BackgroundColor")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("character varying(9)");

                    b.Property<decimal>("MarginBottom")
                        .HasColumnType("numeric");

                    b.Property<string>("MarginFormat")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("MarginLeft")
                        .HasColumnType("numeric");

                    b.Property<decimal>("MarginRight")
                        .HasColumnType("numeric");

                    b.Property<decimal>("MarginTop")
                        .HasColumnType("numeric");

                    b.Property<int>("NoteId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("NoteId")
                        .IsUnique();

                    b.ToTable("note_settings");
                });

            modelBuilder.Entity("webapi.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("text");

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("users");
                });

            modelBuilder.Entity("webapi.Models.Note", b =>
                {
                    b.HasOne("webapi.Models.User", "User")
                        .WithMany("Notes")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("webapi.Models.NoteDefaultSettings", b =>
                {
                    b.HasOne("webapi.Models.User", "User")
                        .WithOne("NoteDefaultSettings")
                        .HasForeignKey("webapi.Models.NoteDefaultSettings", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("webapi.Models.NoteSettings", b =>
                {
                    b.HasOne("webapi.Models.Note", "Note")
                        .WithOne("NoteSettings")
                        .HasForeignKey("webapi.Models.NoteSettings", "NoteId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Note");
                });

            modelBuilder.Entity("webapi.Models.Note", b =>
                {
                    b.Navigation("NoteSettings")
                        .IsRequired();
                });

            modelBuilder.Entity("webapi.Models.User", b =>
                {
                    b.Navigation("NoteDefaultSettings")
                        .IsRequired();

                    b.Navigation("Notes");
                });
#pragma warning restore 612, 618
        }
    }
}