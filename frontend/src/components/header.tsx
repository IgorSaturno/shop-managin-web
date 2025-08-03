import {
  Home,
  List,
  ListTree,
  Notebook,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { ThemeToggle } from "./theme/theme-toogle";
import { AccountMenu } from "./account-menu";
import { Separator } from "./ui/separator";
import { NavLink } from "./nav-link";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Notebook className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4" />
            Início
          </NavLink>
          <NavLink to="/orders">
            <ShoppingBag className="h-4 w-4" />
            Pedidos
          </NavLink>
          <NavLink to="/customers">
            <List className="h-4 w-4" />
            Clientes
          </NavLink>
          <NavLink to="/products">
            <PackageSearch className="h-4 w-4" />
            Products
          </NavLink>
          <NavLink to="/attributes-management">
            <ListTree className="h-4 w-4" />
            Attributes
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
