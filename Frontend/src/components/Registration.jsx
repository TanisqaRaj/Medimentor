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
    <main className="w-full min-h-screen flex flex-col lg:flex-row bg-surface pt-[80px]">
      {/* Left Side: Image/Illustration */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-primary-container items-center justify-center p-xl overflow-hidden fixed top-[80px] left-0 h-[calc(100vh-80px)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-secondary opacity-90"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-xl">
          <div className="flex items-center gap-xs text-on-primary">
            <span className="material-symbols-outlined filled text-display-lg" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
            <span className="font-display-lg text-headline-lg tracking-tight">MediMentor</span>
          </div>
          <div className="flex-grow flex items-center justify-center w-full">
            <img alt="Medical Professional" className="w-4/5 max-w-2xl h-auto object-cover rounded-xl shadow-2xl shadow-primary/20 aspect-[4/3]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOu-TsCkuf0h0KqtOdzy55XYf1teN-zMaz2hOBDVT0vZ6Fm2tS-XmZQfZjEkrZp4GLz1Upngtt2haxasfZRSnHlbsqL_jSt3nX1JsPfuEulGhQNdLuxw3J74PaKuY4ETzDLNHGmAprUms5egbyzQDXREe4zsFzJU41RkNXJiHw-raF_ZxX9nplqJqt8YyGIHhEk_S1fqiVl2kYu6HxZ4PlqQ3B5cwxoLDZw4myMa2L5aWy-5GMlQktNgjfU4DVfbQvtSghFkgPAt7u" />
          </div>
          <div className="max-w-md text-on-primary">
            <p className="font-headline-md text-headline-md mb-sm">"Clinical Clarity Certified."</p>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim">Join thousands of healthcare professionals connecting and learning in a secure environment.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-sm sm:p-xl bg-surface lg:ml-auto">
        <div className="w-full max-w-3xl bg-surface-container-lowest p-lg sm:p-xl rounded-xl shadow-surface border border-surface-variant">
          
          <button onClick={handleBackClick} className="text-primary hover:text-primary-container mb-6 flex items-center transition-colors focus:outline-none font-label-md">
            <i className="fas fa-arrow-left mr-2"></i> Back
          </button>

          <div className="lg:hidden flex items-center gap-xs text-primary mb-xl justify-center">
            <span className="material-symbols-outlined filled text-display-lg text-primary">health_and_safety</span>
            <span className="font-display-lg text-headline-lg tracking-tight">MediMentor</span>
          </div>

          <div className="text-center mb-xl">
            <h1 className="font-display-lg text-display-lg text-primary mb-xs">Sign Up</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Create your MediMentor account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-gutter">
            {/* Name Fields */}
            <div className="flex flex-col sm:flex-row gap-gutter">
              <div className="space-y-xs w-full sm:w-1/2">
                <label className="block font-label-md text-label-md text-on-surface">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">person</span>
                  </div>
                  <input
                    {...register("firstname", { maxLength: { value: 100, message: "max length atmost 100" }, minLength: { value: 2, message: "min length atleast 2" } })}
                    onChange={(e) => validUsername(e.target.value, errors)}
                    type="text"
                    placeholder="Jane"
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface placeholder-outline focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors"
                  />
                </div>
                {errors.firstname && <p className="text-error font-caption text-caption mt-1">{errors.firstname.message}</p>}
              </div>

              <div className="space-y-xs w-full sm:w-1/2">
                <label className="block font-label-md text-label-md text-on-surface">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">person</span>
                  </div>
                  <input
                    {...register("lastname", { maxLength: { value: 100, message: "max length atmost 100" }, minLength: { value: 2, message: "min length atleast 2" } })}
                    onChange={(e) => validUsername(e.target.value, errors)}
                    type="text"
                    placeholder="Doe"
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface placeholder-outline focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors"
                  />
                </div>
                {errors.lastname && <p className="text-error font-caption text-caption mt-1">{errors.lastname.message}</p>}
              </div>
            </div>

            {/* Username & Email */}
            <div className="flex flex-col sm:flex-row gap-gutter">
              <div className="space-y-xs w-full sm:w-1/2">
                <label className="block font-label-md text-label-md text-on-surface">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">badge</span>
                  </div>
                  <input
                    {...register("username", { maxLength: { value: 100, message: "max length atmost 100" }, minLength: { value: 2, message: "min length atleast 2" } })}
                    onChange={(e) => validUsername(e.target.value, errors)}
                    type="text"
                    placeholder="janedoe99"
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface placeholder-outline focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors"
                  />
                </div>
                {errors.username && <p className="text-error font-caption text-caption mt-1">{errors.username.message}</p>}
              </div>

              <div className="space-y-xs w-full sm:w-1/2">
                <label className="block font-label-md text-label-md text-on-surface">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">mail</span>
                  </div>
                  <input
                    {...register("email", { pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address" } })}
                    type="email"
                    placeholder="jane.doe@clinic.com"
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface placeholder-outline focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors"
                  />
                </div>
                {errors.email && <p className="text-error font-caption text-caption mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Password & Contact */}
            <div className="flex flex-col sm:flex-row gap-gutter">
              <div className="space-y-xs w-full sm:w-1/2">
                <label className="block font-label-md text-label-md text-on-surface">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">lock</span>
                  </div>
                  <input
                    {...register("password", { pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character" } })}
                    type="password"
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface placeholder-outline focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors"
                  />
                </div>
                {errors.password && <p className="text-error font-caption text-caption mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-xs w-full sm:w-1/2">
                <label className="block font-label-md text-label-md text-on-surface">Contact No.</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">phone</span>
                  </div>
                  <input
                    {...register("phone", { pattern: { value: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number." } })}
                    type="text"
                    placeholder="1234567890"
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface placeholder-outline focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors"
                  />
                </div>
                {errors.phone && <p className="text-error font-caption text-caption mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Gender & Role */}
            <div className="flex flex-col sm:flex-row gap-gutter">
              <div className="space-y-xs w-full sm:w-1/2">
                <label className="block font-label-md text-label-md text-on-surface">Gender</label>
                <div className="flex space-x-4 items-center h-10">
                  <label className="inline-flex items-center">
                    <input {...register("gender")} value="male" type="radio" className="form-radio text-primary focus:ring-primary border-outline-variant" />
                    <span className="ml-2 font-body-md text-on-surface">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input {...register("gender")} value="female" type="radio" className="form-radio text-primary focus:ring-primary border-outline-variant" />
                    <span className="ml-2 font-body-md text-on-surface">Female</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input {...register("gender")} value="other" type="radio" className="form-radio text-primary focus:ring-primary border-outline-variant" />
                    <span className="ml-2 font-body-md text-on-surface">Other</span>
                  </label>
                </div>
              </div>

              <div className="space-y-xs w-full sm:w-1/2">
                <label className="block font-label-md text-label-md text-on-surface">Select Role</label>
                <select
                  {...register("role")}
                  value={isDoctor}
                  onChange={roleChange}
                  className="block w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors appearance-none"
                >
                  <option value="">Select role</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
                {errors.role && <p className="text-error font-caption text-caption mt-1">{errors.role.message}</p>}
              </div>
            </div>

            {/* Profile Pic */}
            <div className="space-y-xs">
              <label className="block font-label-md text-label-md text-on-surface">Upload Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-grow">
                  <input
                    {...register("profilepic")}
                    type="file"
                    onChange={handleImageChange}
                    className="block w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface-variant file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary hover:file:bg-primary transition-colors"
                  />
                </div>
                {image && (
                  <img src={URL.createObjectURL(image)} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                )}
              </div>
            </div>

            {/* Doctor specific fields */}
            {isDoctor === "doctor" && (
              <div className="p-md bg-surface-container-low rounded-lg border border-outline-variant/50 space-y-gutter mt-sm">
                <h3 className="font-headline-md text-headline-md text-primary mb-sm">Medical Professional Details</h3>
                
                <div className="flex flex-col sm:flex-row gap-gutter">
                  <div className="space-y-xs w-full sm:w-1/2">
                    <label className="block font-label-md text-label-md text-on-surface">Doctor Bio</label>
                    <textarea
                      {...register("doctorBio")}
                      placeholder="Write bio..."
                      className="block w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface placeholder-outline focus:ring-primary focus:border-primary font-body-md text-body-md h-24 resize-none"
                    />
                    {errors.doctorBio && <p className="text-error font-caption text-caption mt-1">{errors.doctorBio.message}</p>}
                  </div>

                  <div className="space-y-xs w-full sm:w-1/2">
                    <label className="block font-label-md text-label-md text-on-surface">Skills</label>
                    <Multiselect
                      className="w-full bg-surface"
                      style={{ searchBox: { border: '1px solid #bdc9c1', borderRadius: '0.25rem', padding: '0.5rem' } }}
                      options={[ "General Physician", "Cardiologist", "GeneralSurgeon", "Pediatrician", "Dermatologist", "Gynecologist", "Orthopedic Surgeon", "Neurologist", "Psychiatrist", "Pulmonologist", "Nephrologist", "Endocrinologist", "Gastroenterologist", "Ophthalmologist", "Oncologist", "Dentist", "Urologist", "ENT Specialist", "Neurosurgeon", "Cosmetic Surgeon", "Anaesthetic" ]}
                      isObject={false}
                      selectedValues={selectedOptions}
                      onSelect={handleSelect}
                      onRemove={handleRemove}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-gutter">
                  <div className="space-y-xs w-full sm:w-1/2">
                    <label className="block font-label-md text-label-md text-on-surface">MCI Number</label>
                    <input
                      {...register("mciNumber")}
                      type="text"
                      className="block w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface focus:ring-primary focus:border-primary font-body-md text-body-md"
                    />
                  </div>
                  <div className="space-y-xs w-full sm:w-1/2">
                    <label className="block font-label-md text-label-md text-on-surface">Upload Certificate</label>
                    <input
                      {...register("uploadCerificate")}
                      type="file"
                      onChange={handleCertificateChange}
                      className="block w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface-variant file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary hover:file:bg-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-gutter">
                  <div className="space-y-xs w-full sm:w-1/2">
                    <label className="block font-label-md text-label-md text-on-surface">Experience (Years)</label>
                    <input
                      {...register("experience")}
                      type="number"
                      className="block w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface focus:ring-primary focus:border-primary font-body-md text-body-md"
                    />
                  </div>
                  <div className="space-y-xs w-full sm:w-1/2">
                    <label className="block font-label-md text-label-md text-on-surface">Department</label>
                    <select {...register("department")} className="block w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-on-surface focus:ring-primary focus:border-primary font-body-md text-body-md appearance-none">
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

            <div className="pt-sm space-y-md">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-DEFAULT shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary/90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
              >
                {isSubmitting ? "Submitting..." : "Create Account"}
              </button>

              <div className="text-center">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Already have an account? 
                  <span className="font-label-md text-label-md text-primary hover:text-secondary transition-colors font-medium ml-xs cursor-pointer" onClick={handleNavigateLogin}>
                    Log In
                  </span>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Registration;
