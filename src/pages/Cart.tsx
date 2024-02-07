import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/ReducerTypes";
import {
  addToCart,
  applyDiscount,
  calculatePrice,
  removeFromCart,
} from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import CartItemCard from "../components/CartItemCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../redux/store";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, subtotal, tax, discount, shippingCharges, total } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>();

  const dispatch = useDispatch();

  const incrementQuantityHandler = (cartItem: CartItem) => {
    if (cartItem.stock > cartItem.quantity) {
      dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
      dispatch(calculatePrice());
    }
  };
  const decrementQuantityHandler = (cartItem: CartItem) => {
    if (cartItem.quantity > 1) {
      dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
      dispatch(calculatePrice());
    }
  };

  const removeHandler = (id: string) => {
    dispatch(removeFromCart(id));
    dispatch(calculatePrice());
  };

  const handleCheckout = () => {
    if (cartItems.length) {
      navigate("/shipping");
    }
  };

  useEffect(() => {
    if (couponCode) {
      const { token: cancelToken, cancel } = axios.CancelToken.source();
      const timeoutID = setTimeout(() => {
        axios
          .get(`${server}/api/v1/payments/discount?coupon=${couponCode}`, {
            cancelToken,
          })
          .then((res) => {
            dispatch(applyDiscount(res.data.discount));
            setIsValidCouponCode(true);
            dispatch(calculatePrice());
          })
          .catch((e) => {
            setIsValidCouponCode(false);
            dispatch(applyDiscount(0));
            dispatch(calculatePrice());
            console.log(e.error.data.message);
          });
      }, 1000);

      return () => {
        clearTimeout(timeoutID);
        setIsValidCouponCode(false);
        cancel();
      };
    }
  }, [couponCode]);

  return (
    <div className="lg:grid lg:grid-cols-4 px-2 xsm:px-8 py-4 mt-[90px]">
      <section className="lg:col-span-3 sm:mx-8 my-4 sm:p-4">
        <h2 className="heading text-xl text-left">
          {cartItems.length ? "Orders Summary" : "No Orders"}
        </h2>
        {cartItems.map((product) => (
          <CartItemCard
            key={product.productId}
            product={product}
            incrementQuantityHandler={incrementQuantityHandler}
            decrementQuantityHandler={decrementQuantityHandler}
            removeHandler={removeHandler}
          />
        ))}
      </section>
      <section className="flex flex-col justify-start my-4 p-4">
        <h2 className="heading text-xl">Orders Info</h2>
        <div className="flex flex-col justify-between">
          <p className="my-2">Subtotal: <span className=" float-right">{subtotal}</span></p>
          <p className="my-2">Shipping Charges: <span className=" float-right">{shippingCharges}</span></p>
          <p className="my-2">Tax: <span className=" float-right">{tax}</span></p>
          <p className="my-2">
            Discount:{" "}
            <span className="text-red-500 float-right">
              {discount ? `-${discount}` : ``}
            </span>
          </p>
          <p className="font-bold my-2">Total: <span className=" float-right">{total}</span></p>
        </div>
        <div className="flex flex-col my-2">
          <input
            type="text"
            name="coupon"
            value={couponCode}
            className="border rounded my-2 px-2 py-2 border-black"
            placeholder="Apply Coupon Code"
            onChange={(e) => {
              setCouponCode(e.target.value);
            }}
          />
          {isValidCouponCode && (
            <p
              className={`text-center mb-2 text-${
                isValidCouponCode ? "green" : "red"
              }-500`}
            >
              {isValidCouponCode ? "Discount applied!" : "Invalid Coupon Code!"}
            </p>
          )}
          <button
            className="bg-black text-white py-2 rounded text-lg"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </section>
    </div>
  );
}

export default Cart;
