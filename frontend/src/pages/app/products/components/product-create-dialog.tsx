import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { TagsInput } from "@/components/TagsInput";

interface ProductCreateDialogProps {
  onClose: () => void;
  refresh: (products: Product[]) => void;
  categories: string[];
  subBrands: string[];
  isOpen: boolean;
}

export default function ProductCreateDialog({
  isOpen,
  onClose,
  refresh,
  categories,
  subBrands,
}: ProductCreateDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [subBrand, setSubBrand] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState<"Disponível" | "Indisponível">(
    "Disponível",
  );
  const [isLoading, setIsLoading] = useState(false);

  // Estados das tags
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const loadTags = () => {
      try {
        const loadedTags = getTags();
        if (Array.isArray(loadedTags)) {
          setAvailableTags(loadedTags.filter((tag) => typeof tag === "string"));
        } else {
          setAvailableTags([]);
        }
      } catch (error) {
        console.error("Erro ao carregar tags:", error);
        setAvailableTags([]);
      }
    };

    if (isOpen) {
      loadTags();
      // Resetar estados quando abre
      setName("");
      setPrice("");
      setStock("");
      setCategory("");
      setSubBrand("");
      setDescription("");
      setImages([]);
      setSelectedTags([]);
    }
  }, [isOpen]);

  const validateFields = () => {
    if (!name.trim()) {
      toast.error("Nome do produto é obrigatório");
      return false;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      toast.error("Preço inválido");
      return false;
    }

    const stockNumber = parseInt(stock);
    if (isNaN(stockNumber) || stockNumber < 0) {
      toast.error("Estoque inválido");
      return false;
    }

    if (!category) {
      toast.error("Selecione uma categoria");
      return false;
    }

    if (!subBrand) {
      toast.error("Selecione uma sub marca");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateFields()) return;

    try {
      setIsLoading(true);

      const imagePromises = images.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          }),
      );

      const imageUrls = await Promise.all(imagePromises);

      const newProduct: Product = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        category: category.trim(),
        subBrand: subBrand.trim(),
        description: description.trim(),
        imageUrl: imageUrls[0] || "/placeholder-image.svg",
        images: imageUrls,
        status,
        tags: Array.isArray(selectedTags) ? selectedTags : [],
        createdAt: new Date().toISOString(),
      };

      saveProduct(newProduct);
      refresh(getProducts());
      onClose();
      toast.success("Produto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error("Falha ao criar produto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Adicionar Novo Produto</DialogTitle>
        <DialogDescription>
          Preencha os campos para criar um novo produto
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Nome do Produto*</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do produto"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Preço (R$)*</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="space-y-1">
            <Label>Estoque*</Label>
            <Input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Quantidade em estoque"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Status*</Label>
          <Select
            value={status}
            onValueChange={(value: "Disponível" | "Indisponível") =>
              setStatus(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponível">Disponível</SelectItem>
              <SelectItem value="Indisponível">Indisponível</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Categoria*</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Sub Marca*</Label>
            <Select onValueChange={setSubBrand} value={subBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sub marca" />
              </SelectTrigger>
              <SelectContent>
                {subBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Tags</Label>
          <TagsInput
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagsChange={(tags) =>
              setSelectedTags(Array.isArray(tags) ? tags : [])
            }
          />
        </div>

        <div className="space-y-1">
          <Label>Descrição</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o produto..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-1">
          <Label>Imagens do Produto (Máx. 4)</Label>
          <ImageUpload
            onUpload={(files) => setImages(files.slice(0, 4))}
            onRemove={(index) =>
              setImages((prev) => prev.filter((_, i) => i !== index))
            }
            initialImages={[]}
            disabled={isLoading}
          />
        </div>

        <Button onClick={handleCreate} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando Produto...
            </>
          ) : (
            "Adicionar Produto"
          )}
        </Button>
      </div>
    </DialogContent>
  );
}
