import { useState } from "react";

const ageGroups = [
  { id: "toddler", label: "Toddlers", range: "1–3 yrs", emoji: "🐣", color: "from-amber-400 to-orange-400" },
  { id: "preschool", label: "Preschool", range: "3–5 yrs", emoji: "🌻", color: "from-lime-400 to-green-400" },
  { id: "school", label: "School Age", range: "6–12 yrs", emoji: "🚀", color: "from-sky-400 to-blue-500" },
  { id: "teen", label: "Teens", range: "13–18 yrs", emoji: "⚡", color: "from-violet-400 to-purple-500" },
];

const nutritionData = {
  toddler: {
    calories: "1,000–1,400",
    protein: "13g",
    calcium: "700mg",
    iron: "7mg",
    tips: [
      "Offer 3 meals + 2–3 small snacks daily",
      "Whole milk until age 2, then 2% or low-fat",
      "Introduce a variety of colors and textures",
      "Avoid added sugars and high-sodium foods",
      "Small portions — a child's fist is 1 serving",
    ],
    foods: [
      { name: "Dairy", items: "Milk, yogurt, soft cheese", icon: "🥛" },
      { name: "Grains", items: "Oatmeal, soft bread, pasta", icon: "🌾" },
      { name: "Fruits", items: "Banana, soft berries, melon", icon: "🍓" },
      { name: "Veggies", items: "Peas, cooked carrots, squash", icon: "🥦" },
      { name: "Protein", items: "Eggs, soft beans, ground meat", icon: "🥚" },
    ],
    avoid: ["Honey (under 1yr)", "Choking hazards", "Cow's milk under 12 months", "Excess juice"],
  },
  preschool: {
    calories: "1,200–1,600",
    protein: "20g",
    calcium: "1,000mg",
    iron: "10mg",
    tips: [
      "Let children help prepare simple foods",
      "Serve fruits and veggies at every meal",
      "Limit fruit juice to 4–6 oz per day",
      "Encourage water as main beverage",
      "Make meals a positive, social experience",
    ],
    foods: [
      { name: "Dairy", items: "Low-fat milk, cheese, yogurt", icon: "🧀" },
      { name: "Grains", items: "Whole wheat bread, rice, cereal", icon: "🍞" },
      { name: "Fruits", items: "Apple slices, grapes (halved), oranges", icon: "🍊" },
      { name: "Veggies", items: "Broccoli, sweet potato, spinach", icon: "🥗" },
      { name: "Protein", items: "Chicken, fish, lentils, tofu", icon: "🍗" },
    ],
    avoid: ["High-sugar cereals", "Sugary drinks", "Fast food regularly", "Processed snacks"],
  },
  school: {
    calories: "1,600–2,200",
    protein: "25–35g",
    calcium: "1,000–1,300mg",
    iron: "8–10mg",
    tips: [
      "Don't skip breakfast — it fuels learning",
      "Pack balanced school lunches with all groups",
      "Healthy after-school snacks prevent overeating",
      "Stay hydrated — 6–8 glasses of water daily",
      "Involve kids in grocery shopping and cooking",
    ],
    foods: [
      { name: "Dairy", items: "Milk, string cheese, Greek yogurt", icon: "🍦" },
      { name: "Grains", items: "Brown rice, whole grain pasta, oats", icon: "🌽" },
      { name: "Fruits", items: "Any whole fruits, dried fruit (small portions)", icon: "🍎" },
      { name: "Veggies", items: "Salads, stir-fry veggies, roasted vegies", icon: "🥕" },
      { name: "Protein", items: "Lean meats, beans, nuts, seeds", icon: "🥜" },
    ],
    avoid: ["Energy drinks", "Excessive screen snacking", "Skipping meals", "Diet foods/drinks"],
  },
  teen: {
    calories: "1,800–2,600",
    protein: "46–52g",
    calcium: "1,300mg",
    iron: "11–15mg",
    tips: [
      "Teens need more calcium for peak bone growth",
      "Iron is critical especially for teen girls",
      "Eat breakfast even on busy school days",
      "Fuel athletic activities with complex carbs",
      "Limit screen time during meals",
    ],
    foods: [
      { name: "Dairy", items: "Fortified milk, yogurt, kefir", icon: "🥤" },
      { name: "Grains", items: "Quinoa, whole grain bread, oats", icon: "🥙" },
      { name: "Fruits", items: "All fresh fruits, smoothies", icon: "🍇" },
      { name: "Veggies", items: "Dark leafy greens, peppers, tomatoes", icon: "🥬" },
      { name: "Protein", items: "Lean beef, fish, eggs, legumes", icon: "🐟" },
    ],
    avoid: ["Energy drinks & sodas", "Crash diets", "Skipping meals for weight loss", "Excessive caffeine"],
  },
};

const macroColors = {
  calories: "bg-rose-100 text-rose-700 border-rose-200",
  protein: "bg-sky-100 text-sky-700 border-sky-200",
  calcium: "bg-amber-100 text-amber-700 border-amber-200",
  iron: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function ChildNutritionGuide() {
  const [active, setActive] = useState("toddler");
  const data = nutritionData[active];
  const group = ageGroups.find((g) => g.id === active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 font-sans p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-4 py-1 text-sm text-orange-600 font-medium mb-4 shadow-sm">
          🌟 Pediatric Nutrition Guide
        </div>
        <h1
          className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 leading-tight"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Feeding Growing
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500"> Minds & Bodies</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto text-base">
          Age-specific nutrition guidance to help your child thrive at every stage of development.
        </p>
      </div>

      {/* Age Group Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {ageGroups.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 border-2 ${
              active === g.id
                ? `bg-gradient-to-r ${g.color} text-white border-transparent shadow-lg scale-105`
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:shadow-md"
            }`}
          >
            <span className="text-xl">{g.emoji}</span>
            <div className="text-left">
              <div>{g.label}</div>
              <div className={`text-xs font-normal ${active === g.id ? "text-white/80" : "text-gray-400"}`}>{g.range}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Daily Calories", value: data.calories, icon: "🔥", style: macroColors.calories },
            { label: "Protein", value: data.protein + "/day", icon: "💪", style: macroColors.protein },
            { label: "Calcium", value: data.calcium + "/day", icon: "🦷", style: macroColors.calcium },
            { label: "Iron", value: data.iron + "/day", icon: "🩸", style: macroColors.iron },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border p-4 text-center ${stat.style} transition-all duration-300`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs font-medium opacity-80 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Food Groups */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-sm">🍽️</span>
              Key Food Groups
            </h2>
            <div className="space-y-3">
              {data.foods.map((food) => (
                <div key={food.name} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                  <span className="text-2xl mt-0.5">{food.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-700 text-sm">{food.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{food.items}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm">💡</span>
              Nutrition Tips
            </h2>
            <ul className="space-y-3">
              {data.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Foods to Limit/Avoid */}
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-rose-700 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-rose-100 rounded-full flex items-center justify-center text-sm">⚠️</span>
            Limit or Avoid
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.avoid.map((item, i) => (
              <span key={i} className="bg-white border border-rose-200 text-rose-600 text-sm px-3 py-1.5 rounded-full font-medium">
                🚫 {item}
              </span>
            ))}
          </div>
        </div>

        {/* Plate Visual */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl p-6 text-white">
          <h2 className="text-lg font-bold mb-2">🍽️ The Healthy Plate Rule</h2>
          <p className="text-white/80 text-sm mb-4">A simple guideline for every meal</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { portion: "½ plate", label: "Fruits & Vegetables", bg: "bg-white/20" },
              { portion: "¼ plate", label: "Whole Grains", bg: "bg-white/20" },
              { portion: "¼ plate", label: "Protein", bg: "bg-white/20" },
              { portion: "1 serving", label: "Dairy on the side", bg: "bg-white/20" },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-2xl p-3 text-center backdrop-blur-sm`}>
                <div className="text-2xl font-extrabold">{item.portion}</div>
                <div className="text-xs text-white/80 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs pb-4">
          ℹ️ This guide is for general reference. Always consult your pediatrician for personalized nutritional advice.
        </p>
      </div>
    </div>
  );
}
