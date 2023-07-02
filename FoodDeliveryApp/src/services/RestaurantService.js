import { apiConstants } from '../constants';
import axios from 'axios';
import { authHeader } from '../utils/generator';
import { getToken } from '../Store';

const getRestaurants = async () => {
  console.log(`RestaurantService | getRestaurants`);
  try {
    let restaurantResponse = await axios.get(
      `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.RESTAURANT}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (restaurantResponse?.status === 200) {
      return {
        status: true,
        message: `Restaurant data fetched`,
        data: restaurantResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Restaurant data not found`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Restaurant data not found`,
    };
  }
};

const getOneRestaurantById = async (restaurantId) => {
  console.log(`RestaurantService | getOneRestaurantById`);
  try {
    let restaurantResponse = await axios.get(
      `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.RESTAURANT}/${restaurantId}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (restaurantResponse?.status === 200) {
      return {
        status: true,
        message: `Restaurant data fetched`,
        data: restaurantResponse?.data?.data,
      };
    } else {
      return {
        status: false,
        message: `Restaurant data not found`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Restaurant data not found`,
    };
  }
};

export default {getRestaurants, getOneRestaurantById};