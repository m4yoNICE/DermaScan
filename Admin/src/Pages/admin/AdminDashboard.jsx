import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { getUserCount } from "../../redux/slices/userSlice.js";
import { getSkinConditions } from "@/redux/slices/skinTypeSlice.js";
import { fetchUsers } from "../../redux/slices/userSlice.js";
import { getConditionCounts, getConditionCountsByProduct } from "../../redux/slices/skinProductSlice.js";
import { fetchProducts } from "../../redux/slices/skinProductSlice.js";

import Api from "../../services/Api.js";

// -------------------- BASIC COMPONENTS --------------------
function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl shadow-sm border ${className}`}>{children}</div>;
}

function CardHeader({ children, className = "" }) {
  return <div className={`px-4 pt-4 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function Avatar({ label }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
      {label}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-lg font-semibold">{value}</h3>
      </CardContent>
    </Card>
  );
}

function KeyValueItem({ left, right }) {
  return (
    <li className="flex justify-between text-sm">
      <span>{left}</span>
      <span>{right}</span>
    </li>
  );
}

function UserItem({ name }) {
  return (
    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
      <Avatar label={name[0]} />
      <span>{name}</span>
    </div>
  );
}

function List({ items, renderItem }) {
  return <ul className="space-y-2">{items.map(renderItem)}</ul>;
}

function ProductColumn({ title }) {
  return (
    <div>
      <h4 className="bg-emerald-500 text-white text-center py-1 rounded-lg mb-2 text-sm">{title}</h4>
      <div className="flex gap-2">
        <div className="w-16 h-16 bg-gray-200 rounded-lg" />
        <div className="w-16 h-16 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const Users = useSelector((state) => state.user?.users || []);
  const usercount = Users.length; 
  const status = useSelector((state) => state.user?.status); 
  const [scanData, setScanData] = React.useState([]);
  const skinConditions = useSelector((state) => state.skinType?.skinConditions || []);

  useEffect(() => {
  console.log("Skin conditions state:", skinConditions);
}, [skinConditions]);



  useEffect(() => {
    dispatch(getUserCount());
    dispatch(fetchUsers());
    dispatch(getSkinConditions());
    dispatch(getConditionCounts());
    dispatch(fetchProducts());
    dispatch(getConditionCountsByProduct());
  }, [dispatch]);

  useEffect(() => {
    const fetchScanPerDay = async () => {
      try {
      const res = await Api.fetchScansPerDay();
      const data = res.data.map(item => Number(item.count));
        setScanData(data);
      } catch (error) {
        console.error("Error fetching skin types:", error);
      }
    };

    fetchScanPerDay();
  }, []);

  const conditionCounts = useSelector((state) => state.products?.getConditionCounts || []);
  const getProducts = useSelector((state) => state.products?.products || []);
  const conditionProduct = useSelector((state) => state.products.getConditionCountsByProduct || [])

const popularProducts = useMemo(() => {
  if (!conditionCounts.length || !conditionProduct.length) {
    console.log("useMemo early return - waiting for data", { conditionCounts, conditionProduct });
    return [];
  }

  const productMap = {};

  conditionProduct.forEach(cp => {
    const count = conditionCounts.find(c => c.conditionId === cp.conditionId)?.count || 0;

    if (!productMap[cp.productId]) {
      productMap[cp.productId] = { productId: cp.productId, name: cp.productName, score: 0 };
    }

    productMap[cp.productId].score += count;
  });

  const result = Object.values(productMap)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return result;
}, [conditionCounts, conditionProduct]);

useEffect(() => {
}, [popularProducts]);

const [noRecommendationData, setNoRecommendationData] = React.useState([]);

useEffect(() => {
  const fetchNoRecommendation = async () => {
    try {
      const res = await Api.getRecommendationNoData();
      const count = res.data.data?.[0]?.count || 0;
      setNoRecommendationData(count);
      console.log("No recommendation data:", res.data);
    } catch (error) {
      console.error("Error fetching no recommendation data:", error);
    }
}
fetchNoRecommendation();
}, []);

  const stats = [
    { title: "Users", value: usercount },
    { title: "Scans per day", value: scanData },
    { title: "Out of Scope", value: noRecommendationData },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Welcome back, Admin</h2>
        <Avatar label="GM" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} />
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold">Selected Recommended Products</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ProductColumn title="Selected" />
              <ProductColumn title="Non-Selected" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-emerald-600 font-semibold text-sm">COMMON SKIN CONDITION DETECTED</h3>
          </CardHeader>
          <CardContent> 
            <List items={skinConditions} renderItem={(item, i) => ( 
              <KeyValueItem key={i} left={item.conditon} right="-" 
              /> )} 
            /> 
            </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold">Users</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {status === "loading" ? (
              <p>Loading users...</p>
            ) : Users.length === 0 ? (
              <p>No users found</p>
            ) : (
              Users.map((user) => (
                <UserItem key={user.id} name={`${user.firstName} ${user.lastName}`} />
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-emerald-600 font-semibold text-sm">
              POPULAR RECOMMENDATION
            </h3>
          </CardHeader>
          <CardContent>
            <List
              items={popularProducts}
              renderItem={(item, i) => (
                <KeyValueItem key={i} left={item.name} right={item.score} />
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}