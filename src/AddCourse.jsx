import { useEffect, useState } from "react";
import { createCourse } from "./services/Course";

function AddCourse({modalActive, setModelActive, getCourses, web3Api, account}) {
    const [modelClass, setModalClass] = useState('');
    const [name, setName] = useState(null);
    const [price, setPrice] = useState(0);
    const [desc, setDesc] = useState(null);

    useEffect(() => {
        if (modalActive) {
            setModalClass('is-active');
        } else {
            setModalClass('');
        }
    }, [modalActive]);

    const handleSubmit = () => {
        if (name && price && desc) {
            const data = {
                name, price, description: desc,
                address_owner: account
            };
            
            createCourse(data).then(data => {
                const {contract}  = web3Api;
                contract.createCourse(data.id, {
                    from: account
                }).then (() => {
                    getCourses();
                    setModelActive(false);
                });
            })
        } else {
            alert('Please input name, price, desc');
        }
    }

    return (
        <div className={`modal ${modelClass}`} id="modal-add-course">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                <p className="modal-card-title">Modal title</p>
                <button className="delete" aria-label="close" onClick={() => setModelActive(false)}>X</button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label">Course Name</label>
                        <div className="control">
                            <input className="input" name="name" type="text" placeholder="Course Name" onChange={(event) => setName(event.target.value)} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Course Price</label>
                        <div className="control">
                            <input className="input" name="price" type="text" placeholder="Course Price (ETH)" onChange={(event) => setPrice(event.target.value)} />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Description</label>
                        <div className="control">
                            <textarea className="textarea" name="desc" placeholder="Description"  onChange={(event) => setDesc(event.target.value)}></textarea>
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                <button className="button is-link" onClick={handleSubmit}>Save changes</button>
                <button className="button is-link is-light" onClick={() => setModelActive(false)}>Cancel</button>
                </footer>
            </div>
        </div>
    )
}

export default AddCourse;