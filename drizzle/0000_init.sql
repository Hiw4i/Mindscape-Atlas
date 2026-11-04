CREATE TABLE `article_ideas` (
	`article_id` integer NOT NULL,
	`idea_id` integer NOT NULL,
	PRIMARY KEY(`article_id`, `idea_id`),
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idea_id`) REFERENCES `ideas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `article_sources` (
	`article_id` integer NOT NULL,
	`source_id` integer NOT NULL,
	PRIMARY KEY(`article_id`, `source_id`),
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `article_tags` (
	`article_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`article_id`, `tag_id`),
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `article_topics` (
	`article_id` integer NOT NULL,
	`topic_id` integer NOT NULL,
	PRIMARY KEY(`article_id`, `topic_id`),
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`question` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`misconceptions` text DEFAULT '' NOT NULL,
	`examples` text DEFAULT '' NOT NULL,
	`takeaways` text DEFAULT '' NOT NULL,
	`evidence_level` text DEFAULT 'mixed' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_demo` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`reading_minutes` integer DEFAULT 0 NOT NULL,
	`search_text` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `idea_relations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from_idea_id` integer NOT NULL,
	`to_idea_id` integer NOT NULL,
	`kind` text DEFAULT 'complements' NOT NULL,
	FOREIGN KEY (`from_idea_id`) REFERENCES `ideas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_idea_id`) REFERENCES `ideas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `idea_tags` (
	`idea_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`idea_id`, `tag_id`),
	FOREIGN KEY (`idea_id`) REFERENCES `ideas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `idea_topics` (
	`idea_id` integer NOT NULL,
	`topic_id` integer NOT NULL,
	PRIMARY KEY(`idea_id`, `topic_id`),
	FOREIGN KEY (`idea_id`) REFERENCES `ideas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ideas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer,
	`title` text NOT NULL,
	`text` text DEFAULT '' NOT NULL,
	`quote` text DEFAULT '' NOT NULL,
	`timecode` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_demo` integer DEFAULT 0 NOT NULL,
	`search_text` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `myth_sources` (
	`myth_id` integer NOT NULL,
	`source_id` integer NOT NULL,
	PRIMARY KEY(`myth_id`, `source_id`),
	FOREIGN KEY (`myth_id`) REFERENCES `myths`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `myth_tags` (
	`myth_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`myth_id`, `tag_id`),
	FOREIGN KEY (`myth_id`) REFERENCES `myths`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `myth_topics` (
	`myth_id` integer NOT NULL,
	`topic_id` integer NOT NULL,
	PRIMARY KEY(`myth_id`, `topic_id`),
	FOREIGN KEY (`myth_id`) REFERENCES `myths`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `myths` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`statement` text NOT NULL,
	`verdict` text DEFAULT 'unproven' NOT NULL,
	`why_believe` text DEFAULT '' NOT NULL,
	`evidence` text DEFAULT '' NOT NULL,
	`unknown` text DEFAULT '' NOT NULL,
	`better` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`is_demo` integer DEFAULT 0 NOT NULL,
	`search_text` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `myths_slug_unique` ON `myths` (`slug`);--> statement-breakpoint
CREATE TABLE `sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text DEFAULT 'other' NOT NULL,
	`title` text NOT NULL,
	`author` text DEFAULT '' NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`is_demo` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `state_articles` (
	`state_id` integer NOT NULL,
	`article_id` integer NOT NULL,
	PRIMARY KEY(`state_id`, `article_id`),
	FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `state_myths` (
	`state_id` integer NOT NULL,
	`myth_id` integer NOT NULL,
	PRIMARY KEY(`state_id`, `myth_id`),
	FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`myth_id`) REFERENCES `myths`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `state_topics` (
	`state_id` integer NOT NULL,
	`topic_id` integer NOT NULL,
	PRIMARY KEY(`state_id`, `topic_id`),
	FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `states` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `states_slug_unique` ON `states` (`slug`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`synonyms` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `topic_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from_topic_id` integer NOT NULL,
	`to_topic_id` integer NOT NULL,
	`kind` text DEFAULT 'related' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`from_topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`parent_id` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topics_slug_unique` ON `topics` (`slug`);