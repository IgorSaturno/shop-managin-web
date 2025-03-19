ALTER TABLE "stores" DROP CONSTRAINT "stores_manager_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;