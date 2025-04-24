import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDoctor, setIsDoctor] = useState("");
  const [image, setImage] = useState("");
  const [certificate, setCertificate] = useState("");
  const navigate = useNavigate();

  const handleSelect = (selectedList) => setSelectedOptions(selectedList);
  const handleRemove = (selectedList) => setSelectedOptions(selectedList);
  const roleChange = (e) => setIsDoctor(e.target.value);

  const validUsername = (text, errors) => {
    if (!/^[^0-9]*$/.test(text)) {
      errors.name = true;
      errors.name.message = "Name can only include letters and spaces";
    }
  };

  //  Optimized Base64 Conversion
  const processFileToBase64 = (file, isCertificate = false) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        //  Check if PDF or Image
        if (isCertificate && file.type === "application/pdf") {
          resolve(base64String); // Store PDF directly as Base64
        } else {
          resolve(base64String); // Compress Image in Backend
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  //  Image Upload
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  //  Certificate Upload
  const handleCertificateChange = async (event) => {
    const file = event.target.files[0];
    if (file) setCertificate(file);
  };

  const handleNavigateLogin = () => navigate("/login");
  const handleBackClick = () => navigate("/");

  async function onSubmit(data) {
    let url =
      data.role === "patient"
        ? "https://medimentorbackend.onrender.com/auth/register/user"
        : "https://medimentorbackend.onrender.com/auth/register/doctor";

    const registerObj = {
      name: data.firstname.trim() + " " + data.lastname.trim(),
      email: data.email,
      phone: data.phone,
      role: data.role === "patient" ? "user" : "doctor",
      username: data.username,
      password: data.password,
      gender: data.gender,
      bio: data.role === "doctor" ? data.doctorBio : null,
      mciNumber: data.role === "doctor" ? data.mciNumber : null,
      profession: data.role === "doctor" ? selectedOptions : null,
      experience: data.role === "doctor" ? data.experience : null,
      department: data.role === "doctor" ? data.department : null,
    };

    try {
      //  Convert Profile Image to Base64
      if (image) {
        registerObj.image = await processFileToBase64(image);
      }

      //  Convert Certificate to Base64 (PDF or Image)
      if (certificate) {
        registerObj.certificate = await processFileToBase64(certificate, true);
      }

      console.log("📤 Register object:", registerObj);

      //  Submit Form
      axios
        .post(url, registerObj)
        .then((response) => {
          console.log("✅ Registration successful:", response.data);
          navigate("/login");
        })
        .catch((error) => {
          console.error("❌ Registration failed:", error);
        });
    } catch (error) {
      console.error("❌ Error processing files:", error);
    }
  }

  return (
    <div
      className="w-full min-h-screen flex justify-center items-center rounded-lg py-5 px-5 md:py-20 md:px-40 bg-opacity-20 backdrop-blur-sm"
      style={{
        backgroundImage: "url('../src/assets/images/BGregistration.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-w-10 px-3 md:px-16 pb-16 space-y-4 bg-white bg-opacity-30 backdrop-blur-sm rounded-lg shadow-lg"
      >
        {/* Previous page */}
        <button onClick={handleBackClick} className="text-emerald-600 mb-4">
          <i className="fas fa-arrow-left"></i>
        </button>

        {/* Signup text */}
        <div className="flex items-center justify-center">
          <h2 className="text-2xl sm:text-4xl text-emerald-500 p-2 mb-1">
            Let&apos;s you sign up
          </h2>
        </div>

        {/* Name */}
        <div className="flex-col gap-1 items-center">
          <label>Name</label>
          <div className="flex flex-row w-full space-x-6">
            <input
              {...register("firstname", {
                maxLength: { value: 100, message: "max length atmost 100" },
                minLength: { value: 2, message: "min length atleast 2" },
              })}
              onChange={(e) => validUsername(e.target.value, errors)}
              type="text"
              placeholder="First name"
              className="w-1/2 mb-2 px-3 py-1 border border-gray-300 rounded-lg "
            />
            {errors.firstname && (
              <p className="text-red-700">{errors.firstname.message}</p>
            )}
            <input
              {...register("lastname", {
                maxLength: { value: 100, message: "max length atmost 100" },
                minLength: { value: 2, message: "min length atleast 2" },
              })}
              onChange={(e) => validUsername(e.target.value, errors)}
              type="text"
              placeholder="Last name"
              className="w-1/2 mb-2 px-3 py-1 border border-gray-300 rounded-lg "
            />
            {errors.lastname && (
              <p className="text-red-700">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        {/* Username */}
        <div>
          <label>Username</label>
          <input
            {...register("username", {
              maxLength: { value: 100, message: "max length atmost 100" },
              minLength: { value: 2, message: "min length atleast 2" },
            })}
            onChange={(e) => validUsername(e.target.value, errors)}
            type="text"
            placeholder="Enter your name..."
            className="w-full mb-2 px-3 py-1 border border-gray-300 rounded-lg "
          />
          {errors.username && (
            <p className="text-red-700">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input
            {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="Enter your email..."
            className="w-full px-3 mb-2 py-1 border border-gray-300 rounded-lg"
          />
          {errors.email && (
            <p className="text-red-700">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label>Password</label>
          <input
            {...register("password", {
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character",
              },
            })}
            type="password"
            placeholder="Type password..."
            className="w-full px-3 py-1 mb-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.password && (
            <p className="text-red-700">{errors.password.message}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label>Contact</label>
          <input
            {...register("phone", {
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number.",
              },
            })}
            type="text"
            placeholder="Enter your Contact no.."
            className="w-full px-3 py-1 mb-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.phone && (
            <p className="text-red-700">{errors.phone.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col md:flex-row md:space-x-2">
          <div>
            <label>Gender</label>
          </div>

          <div className="space-x-2 flex">
            <input
              {...register("gender")}
              value="male"
              type="radio"
              name="gender"
              id="male"
            />
            <label htmlFor="male">Male</label>
            <input
              {...register("gender")}
              value="female"
              type="radio"
              name="gender"
              id="female"
            />
            <label htmlFor="female">Female</label>
            <input
              {...register("gender")}
              value="other"
              type="radio"
              name="gender"
              id="other"
            />
            <label htmlFor="other">Other</label>
          </div>
        </div>

        {/* ProfilePic */}
        <div className="flex gap-0.5 overflow-clip">
          <label>Upload pic </label>
          <input
            {...register("profilepic")}
            type="file"
            onChange={handleImageChange}
          />
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt=""
              className="border w-40 h-40 rounded-md"
            />
          ) : (
            <img src={image} alt="" className="border w-4 h-4 rounded-md" />
          )}
        </div>

        {/* Select Role */}
        <div>
          <label>Select Role</label>
          <select
            {...register("role")}
            className={`w-full px-3 py-1 mb-2 border "hover:bg-emerald-500 rounded-lg`}
            value={isDoctor}
            onChange={roleChange}
            placeholder="Select role"
          >
            <option value="">Select role</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          {errors.role && (
            <p className=" text-red-700">{errors.role.message}</p>
          )}
        </div>

        {/* If selected role is doctor */}
        {isDoctor === "doctor" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center md:space-x-5">
              {/* DoctorBio */}
              <div className="flex-row w-1/2">
                <label className="block mb-1 ">Doctor Bio</label>
                <textarea
                  className={"w-full px-4 py-2 border rounded"}
                  placeholder="Write bio....."
                  {...register("doctorBio")}
                />
                {errors.doctorBio && (
                  <p className=" text-red-500">{errors.doctorBio.message}</p>
                )}
              </div>

              {/* Skills */}
              <div className=" w-1/2 flex-col space-y-2">
                <label className="block">Skills</label>
                <Multiselect
                  className="w-full"
                  options={[
                    "General Physician",
                    "Cardiologist",
                    "GeneralSurgeon",
                    "Pediatrician",
                    "Dermatologist",
                    "Gynecologist",
                    "Orthopedic Surgeon",
                    "Neurologist",
                    "Psychiatrist",
                    "Pulmonologist",
                    "Nephrologist",
                    "Endocrinologist",
                    "Gastroenterologist",
                    "Ophthalmologist",
                    "Oncologist",
                    "Dentist",
                    "Urologist",
                    "ENT Specialist",
                    "Neurosurgeon",
                    "Cosmetic Surgeon",
                    "Anaesthetic",
                  ]}
                  isObject={false}
                  selectedValues={selectedOptions}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                />
              </div>
            </div>

            {/* MCI number */}
            <div>
              <label>MCI number</label>
              <input
                type="text"
                {...register("mciNumber")}
                className="w-full px-3 mb-2 py-1 border border-gray-300 rounded-lg"
              />
            </div>

            {/* UploadCertificate */}
            <div>
              <label>Upload Certificate</label>
              <input
                {...register("uploadCerificate")}
                type="file"
                onChange={handleCertificateChange}
                className="w-full px-3 mb-2 py-1 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Experience and department */}
            <div className="w-full flex flex-col md:flex-row justify-center flex-row md:space-x-2">
              {/* Experience */}
              <div className="w-fit md:w-1/2">
                <label>Experience</label>
                <input
                  className="border items-center w-full h-8"
                  type="number"
                  {...register("experience")}
                />
                <span>Years</span>
              </div>
              {/* department*/}
              <div className="w-fit md:w-1/2 self-start flex flex-col">
                <label className="gap-x-3 p-1">Department</label>
                <select {...register("department")} className="border">
                  <option>Select department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="NeuroSurgery">NeuroSurgery</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="GeneralSurgery">GeneralSurgery</option>
                  <option value="Dentistry">Dentistry</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Urology">Urology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Ophthalmnology">Ophthalmnology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="ENT">ENT</option>
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="Nephrology">Nephrology</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SignUp SignIn Button */}
        <div className="flex w-full">
          <div className="w-1/2">
            <button
              type="Submit"
              className="w-full px-4 py-2 md:font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 "
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "SignUp"}
            </button>
          </div>

          <div
            className="flex flex-row justify-center items-center"
            onClick={handleNavigateLogin}
          >
            <p className="text-center p-2 text-white text-sm md:text-lg">
              Already have an account?
            </p>
            <p className="text-sm md:text-lg text-emerald-400 hover:cursor-pointer">
              SignIn
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registration;
