import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagementTableTags } from "./components/tags/management-table-tags";
import { ManagementTableCategories } from "./components/categories/management-table-categories";
import { ManagementTableBrands } from "./components/brands/management-table-brands";
import { ManagementTableCoupons } from "./components/coupons/management-table-coupons";
import { Helmet } from "react-helmet-async";

export function ManagementAttributes() {
  return (
    <>
      <Helmet title="Attributes" />
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Gerenciamento</h1>

        <Tabs defaultValue="tags" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="brands">Marcas</TabsTrigger>
            <TabsTrigger value="coupons">Cupons</TabsTrigger>
          </TabsList>

          <TabsContent value="tags">
            <ManagementTableTags />
          </TabsContent>

          <TabsContent value="categories">
            <ManagementTableCategories />
          </TabsContent>

          <TabsContent value="brands">
            <ManagementTableBrands />
          </TabsContent>

          <TabsContent value="coupons">
            <ManagementTableCoupons />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
