import { useState } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Modal } from "../components/modal";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    localStorage.setItem("username", username);
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("username", username);
      setLoading(false);
      navigate("/home");
    }, 1000);
  };

  return (
    <Modal isOpen={true} signup>
      <div className="md:w-125 h-40 flex flex-col gap-5">
        <div className="font-bold text-lg">Welcome to CodeLeap network!</div>
        <Input
          type="text"
          placeholder="John Doe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Please enter your username"
        />
        <div className="w-full flex justify-end">
          <Button
            text="ENTER"
            onClick={handleEnter}
            loading={loading}
            disabled={loading || username.trim() === ""}
          />
        </div>
      </div>
    </Modal>
  );
};
