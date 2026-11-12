import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import { RutaPrivada, RutaAdmin } from "./components/RutasProtegidas";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import OrdenConfirmada from "./pages/OrdenConfirmada";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

//******************* PUNTO 2 */
import OlvidePassword from "./pages/OlvidePassword";
import RestablecerPassword from "./pages/RestablecerPassword";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* PUNTO 2 */}
          <Route path="/olvide-password" element={<OlvidePassword />} />
          <Route path="/restablecer/:token" element={<RestablecerPassword />} />  

          <Route
            path="/carrito"
            element={
              <RutaPrivada>
                <Carrito />
              </RutaPrivada>
            }
          />
          <Route
            path="/orden/:id"
            element={
              <RutaPrivada>
                <OrdenConfirmada />
              </RutaPrivada>
            }
          />
          <Route
            path="/perfil"
            element={
              <RutaPrivada>
                <Perfil />
              </RutaPrivada>
            }
          />

          <Route
            path="/admin"
            element={
              <RutaAdmin>
                <AdminLayout />
              </RutaAdmin>
            }
          >
            <Route index element={<AdminProductos />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
