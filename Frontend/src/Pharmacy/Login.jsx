import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

 async function onSubmit(data) {
    await new Promise((resolve) => setTimeout(resolve , 5000));
    console.log("Submitting the form...", data);
  }

 function roleChange(e){
    setIsDoctor(e.target.value)
 }

  const [isDoctor, setIsDoctor] = useState('');

  function validUsername(text,errors){
    if(!(/^[^0-9]*$/.test(text))){
      errors.name=true
      errors.name.message="Name can only include letters and spaces"
    }
  }

  return (
    
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center w-[100vw] h-[100vh] bg-emerald-400"
    >
      <div className="mb-4 w-full max-w-sm p-6 bg-slate-100 rounded-lg shadow-md">
        <h2 className=" mb-2 text-2xl font-semibold text-center text-gray-700">
          Login
        </h2>
        <div className="flex flex-row items-center space-x-1">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Name:
          </label>
          <input
            {...register("name", 
            {
              required: true,
              maxLength: {value:100, message:"max length atmost 100"},
              minLength: {value:2, message:"min length atleast 2"},
            },
            // {  pattern: {
            //   value: /^[^0-9]*$/,
            //   message: "Name can only include letters and spaces",
            //  }
            // }
            
            )}
            onChange={(e)=>validUsername(e.target.value,errors)}
            type="text"
            placeholder="Enter your name..."
            className="w-full mb-2 px-3 py-1 border border-gray-300 rounded-lg "
            // className={errors.name? 'input-error': " "}
          />
            {errors.name && <p className="text-red-700">{errors.name.message}</p>}
        </div>

        <div className="flex flex-row items-center space-x-1">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Email:
          </label>
          <input
            {...register("email", 
              { required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
             })}
            type="email"
            placeholder="Enter your email..."
            className="w-full px-3 mb-2 py-1 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.email && <p className="text-red-700">{errors.email.message}</p>}
        </div>

        <div className="flex flex-row items-center space-x-1">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Password:
          </label>
          <input
            {...register("password",
               { required: true ,
                 pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character",
                },

               })}
            type="password"
            placeholder="Type password..."
            className="w-full px-3 py-1 mb-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.password && <p className="text-red-700">{errors.password.message}</p>}
        </div>

        <div className="flex flex-row items-center space-x-1"> 
            <label className="block mb-1 text-sm font-medium text-gray-600">Role</label>
            <select
              {...register("role", { 
                required: "Role is required" })}
              className={`w-full px-3 py-1 mb-2 border  rounded-lg`
              
              }
              value={isDoctor}
              onChange={roleChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
            {errors.role && (<p className=" text-red-700">{errors.role.message}</p>)}
          </div>

          {isDoctor==='doctor' && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Doctor Bio</label>
              <textarea
                className={'w-full px-4 py-2 border rounded'}
                placeholder="Write bio....."
                {...register("doctorBio", { required:true })}
                
              />
              {errors.doctorBio && (<p className=" text-red-500">{errors.doctorBio.message}</p>)}
            </div>
          )}

        <div>
          <button
            type="submit"
            placeholder="Submit"
            className="w-full px-4 py-2 font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 "
            disabled={isSubmitting}
           
          >
          {isSubmitting  ? "Submitting..." : "Submit" }
            
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
