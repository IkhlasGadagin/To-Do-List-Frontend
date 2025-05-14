import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, TextInput, PasswordInput, FileInput, Image, Stack, Loader } from "@mantine/core";
import "@mantine/core/styles.css";
import axios from "axios";
import { useSnackbar } from "notistack";

function Register() {
  const [opened, { open, close }] = useDisclosure(false);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    username: "",
    avatar: null,
    coverImage: null,
    avatarPreview: null,
    coverImagePreview: null,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        data.append(key, formData[key]);
      } else if (key !== "avatarPreview" && key !== "coverImagePreview") {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_APP_URL}/user/register`, data);
      console.log(response);
      enqueueSnackbar("User registered successfully", { variant: "success" });
      close();
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.status === 409) {
        enqueueSnackbar("User already exists", { variant: "error" });
      } else {
        enqueueSnackbar("Error registering user", { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (file, name) => {
    if (file) {
      setFormData({
        ...formData,
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file),
      });
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Register" centered size="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            <TextInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
            <TextInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <TextInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              required
            />

            <FileInput
              label="Avatar"
              accept=".png,.jpeg,.jpg"
              onChange={(file) => handleImageChange(file, "avatar")}
              required
            />
            {formData.avatarPreview && (
              <Image
                src={formData.avatarPreview}
                alt="Avatar"
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <FileInput
              label="Cover Image"
              accept=".png,.jpeg,.jpg"
              onChange={(file) => handleImageChange(file, "coverImage")}
              required
            />
            {formData.coverImagePreview && (
              <Image
                src={formData.coverImagePreview}
                alt="Cover Image"
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <Button
              type="submit"
              fullWidth
              leftIcon={loading ? <Loader size="xs" /> : null}
            >
              {loading ? "Loading..." : "Register"}
            </Button>
          </Stack>
        </form>
      </Modal>

      <Button variant="subtle" onClick={open} className="text-gray-400 hover:text-blue-400">
        Register
      </Button>
    </>
  );
}

export default Register;
