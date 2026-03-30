CREATE TABLE `mod` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` integer,
	`provider` text,
	`name` text NOT NULL,
	`url` text,
	`current_mc_version_supported` text,
	`latest_mc_version_supported` text,
	`last_checked_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`modpack_id` integer NOT NULL,
	FOREIGN KEY (`modpack_id`) REFERENCES `modpack`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `modpack` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` integer,
	`provider` text,
	`uuid` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`url` text,
	`mc_version` text,
	`finalized` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `modpack_uuid_unique` ON `modpack` (`uuid`);