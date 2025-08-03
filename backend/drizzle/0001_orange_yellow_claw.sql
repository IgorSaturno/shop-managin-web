ALTER TABLE "discount_coupons" DROP CONSTRAINT "discount_coupons_code_unique";--> statement-breakpoint
ALTER TABLE "discount_coupons" ADD CONSTRAINT "unique_code_per_store" UNIQUE("code","store_id");