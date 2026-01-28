CREATE TABLE `journals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`journal_text` text DEFAULT ('NULL'),
	`user_id` int NOT NULL,
	`journal_date` date NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `journals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `otp` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`otp_code` varchar(255) NOT NULL,
	`isUsed` boolean NOT NULL,
	`expiresAt` datetime(3) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `otp_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role_name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `role_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skin_analysis_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`image_id` int,
	`user_id` int NOT NULL,
	`status` varchar(255) NOT NULL,
	`condition_id` int NOT NULL,
	`confidence_scores` double NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `skin_analysis_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skin_care_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_name` varchar(255) DEFAULT 'NULL',
	`product_image` varchar(255) DEFAULT 'NULL',
	`ingredient` varchar(255) DEFAULT 'NULL',
	`description` varchar(255) DEFAULT 'NULL',
	`product_type` varchar(255) DEFAULT 'NULL',
	`locality` varchar(255) DEFAULT 'NULL',
	`skin_type` varchar(255) DEFAULT 'NULL',
	`derma_tested` boolean,
	`time_routine` varchar(255) DEFAULT 'NULL',
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `skin_care_products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skin_conditions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`condition` varchar(255) DEFAULT 'NULL',
	`can_recommend` varchar(255) DEFAULT 'NULL',
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `skin_conditions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skin_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`skin_type` varchar(255) DEFAULT 'NULL',
	`skin_sensitivity` varchar(255) DEFAULT 'NULL',
	`pigmentation` varchar(255) DEFAULT 'NULL',
	`aging` varchar(255) DEFAULT 'NULL',
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `skin_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `Skin_data_user_id_key` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `stored_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photoUrl` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `stored_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) DEFAULT 'NULL',
	`last_name` varchar(255) DEFAULT 'NULL',
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role_id` int NOT NULL,
	`birthdate` date DEFAULT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `journals` ADD CONSTRAINT `journals_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `otp` ADD CONSTRAINT `otp_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `skin_analysis_transactions` ADD CONSTRAINT `skin_analysis_transactions_image_id_stored_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `stored_images`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `skin_analysis_transactions` ADD CONSTRAINT `skin_analysis_transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `skin_analysis_transactions` ADD CONSTRAINT `skin_analysis_transactions_condition_id_skin_conditions_id_fk` FOREIGN KEY (`condition_id`) REFERENCES `skin_conditions`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `skin_data` ADD CONSTRAINT `skin_data_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `stored_images` ADD CONSTRAINT `stored_images_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE restrict ON UPDATE cascade;