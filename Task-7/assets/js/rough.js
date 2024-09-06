const addNewStudentData = (e) => {
    e.preventDefault();
    // ! get student details (immutable)
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;

    const dob_initial = new Date(document.getElementById("dob").value);
    const dob = convertToLocaleDateString(dob_initial);

    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;

    const gyear_initial = new Date(document.getElementById("gyear").value);
    const gyear = convertToLocaleDateStringMonth(gyear_initial);

    if (isValidForm() && isEducationValidForm()) {
        setTimeout(() => {
            [
                document.getElementById("fname"),
                document.getElementById("lname"),
                document.getElementById("dob"),
                document.getElementById("email"),
                document.getElementById("address"),
                document.getElementById("gyear"),
            ].forEach((input) => {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
            });
        }, 1000);
        // ! JSON for education data

        let educationData = [];

        for (let i = 1; i < count; i++) {
            educationData.push({
                degreeOrBoard: document.getElementById(`degreeOrBoard${i}`).value,
                schoolOrCollege: document.getElementById(`schoolOrCollege${i}`).value,
                sdate: document.getElementById(`sdate${i}`).value,
                passYear: document.getElementById(`passYear${i}`).value,
                percentage: document.getElementById(`percentage${i}`).value,
                backlog: document.getElementById(`backlog${i}`).value,
            });
        }

        // ? final JSON

        const studentData = {
            first_name: fname,
            last_name: lname,
            date_of_birth: dob,
            email,
            address,
            graduation_year: gyear,
            education: educationData,
        };
        prevData[`student-${lengthOfObject(prevData) + 1 - deletedRows}`] = studentData;

        localStorage.setItem("data", JSON.stringify(prevData));
        loadNewData();

        form.reset();

        document.getElementById("btn-close").click();
    } else {
        alert("Invalid form details.")
    }
};