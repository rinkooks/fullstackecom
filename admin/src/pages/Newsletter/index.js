import { useEffect, useState } from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Button } from "@mui/material";
import { MdDelete } from "react-icons/md";

const Newsletter = () => {
const [newsletter, setNewsletter] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");

const getSubscribers = () => {
  setLoading(true);
  fetchDataFromApi("/api/newsletter").then((res) => {
    setNewsletter(res.newsletterList || []);
    setLoading(false);
  });
};
useEffect(() => {
  getSubscribers();
}, []);

const deleteSubscriber = (id) => {
  if (!window.confirm("Delete this subscriber?")) return;
  deleteData(`/api/newsletter/${id}`).then(() => {
    getSubscribers();
  });
};
const filteredList = newsletter.filter((item) =>
  item.email.toLowerCase().includes(search.toLowerCase())
);
return (
  <section className="right-content w-100">
    <div className="card shadow border-0 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Newsletter Subscribers</h3>
        <div className="badge bg-primary fs-6">
          Total : {newsletter.length}
        </div>
      </div>
      <input type="text" className="form-control mb-4" placeholder="Search Email..."
        value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Subscribe Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              loading ?
                <tr>
                  <td colSpan="4" className="text-center">
                    Loading...
                  </td>
                </tr>
                :
                filteredList.length === 0 ?
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Subscriber Found
                    </td>
                  </tr>

                  :

                  filteredList.map((item, index) => (

                    <tr key={item._id}>

                      <td>{index + 1}</td>

                      <td>{item.email}</td>

                      <td>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td>

                        <Button
                          color="error"
                          onClick={() => deleteSubscriber(item._id)}
                        >
                          <MdDelete />
                        </Button>

                      </td>

                    </tr>

                  ))

            }

          </tbody>

        </table>

      </div>

    </div>

  </section>
);
};
export default Newsletter;