import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <h2 className="text-center">Login As</h2>
        <div className="d-flex justify-content-between mt-5 mb-2">
          <Link to="/employee_login" type="button" className="btn btn-primary">
            Employee
          </Link>
          <Link type="button" className="btn btn-success" to={"/adminlogin"}>
            Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
