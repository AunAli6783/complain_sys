import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";
import ComplaintDetails from "./pages/ComplaintDetails.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/complaints" element={<MyComplaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}