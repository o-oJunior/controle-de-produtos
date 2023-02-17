import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/home/home";
import Cadastrar from "./pages/cadastrar/cadastrar";
import Produtos from "./pages/produtos/produtos";
import Visualizar from "./pages/visualizar/visualizar";
import Editar from "./pages/editar/editar";
import Venda from "./pages/venda/venda";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/venda' element={<Venda />} />
                <Route exact path='/produtos' element={<Produtos />} />
                <Route exact path='/produtos/cadastrar' element={<Cadastrar />} />
                <Route exact path='/produtos/visualizar/:id' element={<Visualizar />} />
                <Route exact path='/produtos/editar/:id' element={<Editar />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;