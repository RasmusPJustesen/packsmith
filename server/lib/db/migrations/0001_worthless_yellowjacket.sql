CREATE TABLE `mods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`curseforge_id` integer,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`current_mc_version_supported` text,
	`latest_mc_version_supported` text,
	`last_checked_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`modpack_id` integer NOT NULL,
	FOREIGN KEY (`modpack_id`) REFERENCES `modpacks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mods_slug_unique` ON `mods` (`slug`);