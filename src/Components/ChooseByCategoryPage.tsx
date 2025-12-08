// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "./UI/card";
// import { motion } from "framer-motion";
// import axios from "axios";

// // CategoryCard Component
// const CategoryCard = ({ category, onClick }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.03 }}
//       whileTap={{ scale: 0.98 }}
//       className="cursor-pointer"
//       onClick={onClick}
//     >
//       <Card className="p-6 flex items-center justify-center rounded-2xl shadow-md hover:shadow-lg text-center">
//         <CardContent className="text-xl font-semibold">
//           {category.name}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// // Main Page
// const ChooseByCategoryPage = () => {
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("/api/category");
//         setCategories(res.data);
//       } catch (error) {
//         console.error("Error fetching categories", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const goToCategory = (categoryId) => {
//     navigate(`/recipes/category/${categoryId}`);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold text-center mb-8">בחרי לפי קטגוריה</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {categories.map((cat) => (
//           <CategoryCard
//             key={cat.id}
//             category={cat}
//             onClick={() => goToCategory(cat.id)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChooseByCategoryPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// טיפוס לקטגוריה
interface Category {
  id: number;
  name: string;
}

// Props ל־CategoryCard
interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

// קומפוננטת כרטיס קטגוריה
const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6 flex items-center justify-center rounded-2xl shadow-md hover:shadow-lg text-center bg-white">
        <div className="text-xl font-semibold">{category.name}</div>
      </div>
    </motion.div>
  );
};

// העמוד הראשי
const ChooseByCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  // טוען קטגוריות מהשרת
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>("/api/category");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  // ניווט לפי קטגוריה
  const goToCategory = (categoryId: number) => {
    navigate(`/recipes/category/${categoryId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">בחרי לפי קטגוריה</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onClick={() => goToCategory(cat.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseByCategoryPage;
