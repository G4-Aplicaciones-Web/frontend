import axios from 'axios';

const BASE_URL = 'http://localhost:3000/meal_plan_day_meals';

export const getAllByMealPlanId = async (mealPlanId) => {
    const res = await axios.get(`${BASE_URL}?meal_plan_id=${mealPlanId}`);
    return res.data;
};

export const createMeal = async (data) => {
    await axios.post(BASE_URL, data);
};

export const updateMeal = async (data) => {
    await axios.put(`${BASE_URL}/${data.id}`, data);
};

export const removeMeal = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
};