const container = document.getElementById("input-container");
const addBtn = document.getElementById("add-row-btn");
const form = document.getElementById("student-form");
let count = 3;
let trRowNo = 0;
let prevData = {};
let deletedRows = 0;

// ! student details validation functions

const isEmpty = (value) => {
    return value.trim() === "";
};

const isValidFname = (name) => {
    return /^[a-zA-Z]{1,10}$/.test(name);
}
function isValidLname(lname) {
    return /^[a-zA-Z]{1,10}$/.test(lname);
}

const isValidDateOfBirth = (date) => {
    const currentDate = new Date();
    const maxDOBYear = currentDate.getFullYear() - 18; // 18 years ago from the current year
    date = new Date(date);

    return (
        date.getFullYear() <= maxDOBYear &&
        (date.getFullYear() < currentDate.getFullYear() ||
            (date.getFullYear() === currentDate.getFullYear() &&
                (date.getMonth() < currentDate.getMonth() ||
                    (date.getMonth() === currentDate.getMonth() &&
                        date.getDate() < currentDate.getDate()))))
    );
};


const isValidGraduationYear = (date) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    date = new Date(date);
    const graduationYear = date.getFullYear();
    const graduationMonth = date.getMonth() + 1;
    return (
        graduationYear >= currentYear + 1 &&
        graduationYear <= currentYear + 10 &&
        (graduationYear > currentYear + 1 || graduationMonth >= currentMonth)
    );
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidAddress = (address) => {
    return address.trim().split(/\s+/).length > 5;
};

// ! education details validation functions

const isValidDegreeOrBoard = (degreeOrBoard) => {
    return degreeOrBoard.length <= 15;
}

const isValidSchoolOrCollege = (schoolOrCollege) => {
    return schoolOrCollege.length <= 15;
}

const isValidStartDate = (startDate) => {
    return startDate.trim() !== "";
}

const isValidPassoutYear = (passoutYear, startDate) => {
    return startDate !== "" &&
        (new Date(passoutYear).getFullYear() - new Date(startDate).getFullYear() >= 1) &&
        (new Date(passoutYear).getFullYear() - new Date(startDate).getFullYear() <= 10);
}

const isValidPercentage = (percentage) => {
    return /^\d+(\.\d+)?$/.test(percentage) && parseFloat(percentage) >= 0 && parseFloat(percentage) <= 100;
}


const isValidBacklog = (backlog) => {
    return /^\d+$/.test(backlog) && parseInt(backlog) >= 0 && parseInt(backlog) <= 30;
}


const lengthOfObject = (obj) => {
    return Object.keys(obj).length;
};

// ! date conversions
const convertToLocaleDateStringMonth = (date) => {
    const formattedDate = date.toLocaleDateString("en-IN", {
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate;
};
const convertToLocaleDateString = (date) => {
    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate;
};
const convertToGlobalDateFormat = (date) => {
    const parts = date.split("/");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else if (parts.length === 2) {
        return `${parts[1]}-${parts[0]}`;
    } else {
        return null;
    }
};


const addInputEventListeners = () => {
    const inputs = form.elements;
    for (let i = 0; i < inputs.length; i++) {
        switch (inputs[i].id) {
            case "fname":
            case "lname":
            case "dob":
            case "email":
            case "address":
            case "gyear":
                inputs[i].addEventListener("input", isValidForm);
                break;
            case "add-row-btn":
                break;
            case `remove-row-btn`:
                break;
            case "": break;
            default:
                if (!inputs[i].id.startsWith("remove-row-btn-")) {
                    inputs[i].addEventListener("input", isEducationValidForm);
                }
                break;
        }
    }
}

document.getElementById("btn-close").addEventListener("click", () => {
    form.reset();
    form.removeEventListener("submit", updateStudentData);
    form.addEventListener("submit", addNewStudentData);
    setTimeout(() => {
        [
            document.getElementById("fname"),
            document.getElementById("lname"),
            document.getElementById("dob"),
            document.getElementById("email"),
            document.getElementById("address"),
            document.getElementById("gyear"),
        ].forEach((input) => {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        });
    }, 1000);
    document.getElementById("education-form").style.display = "block";
    trRowNo = 0;
});
const callEdit = (element) => {
    document.getElementById("education-form").style.display = "none";
    [
        document.getElementById("fname"),
        document.getElementById("lname"),
        document.getElementById("dob"),
        document.getElementById("email"),
        document.getElementById("address"),
        document.getElementById("gyear"),
    ].forEach((input) => {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    });

    const rowNo = element.id.split("-").pop();
    trRowNo = rowNo;
    const studentKey = `student-${rowNo}`;
    const student = prevData[studentKey];

    document.getElementById("fname").value = student.first_name;
    document.getElementById("lname").value = student.last_name;
    document.getElementById("dob").value = convertToGlobalDateFormat(
        student.date_of_birth
    );
    document.getElementById("email").value = student.email;
    document.getElementById("address").value = student.address;
    document.getElementById("gyear").value = convertToGlobalDateFormat(
        student.graduation_year
    );

    form.removeEventListener("submit", addNewStudentData);
    form.addEventListener("submit", updateStudentData);
};

const loadNewData = () => {
    const dataFromLS = JSON.parse(localStorage.getItem("data"));
    const resultTable = document.getElementById("result-table");

    if (dataFromLS && lengthOfObject(dataFromLS) !== 0) {
        prevData = dataFromLS;

        // ! Clear previous content
        resultTable.innerHTML = "";

        let index = 1;
        for (const student of Object.values(prevData)) {
            let row = document.createElement("tr");
            row.id = `student-${index}`;
            // ? tooltip attributes
            row.setAttribute("data-bs-toggle", "tooltip");
            row.setAttribute("data-bs-placement", "top");
            row.setAttribute("title", "See detailed student details.");

            row.innerHTML = `
            <td class="text-nowrap">
                ${student.first_name}
            </td>
            <td class="text-nowrap">
                ${student.last_name}
            </td>
            <td class="text-nowrap">
                ${student.date_of_birth}
            </td>
            <td class="text-nowrap">
                ${student.email}
            </td>
            <td class="text-nowrap">
                ${student.address}
            </td>
            <td class="text-nowrap">
                ${student.graduation_year}
            </td>
            
            <td class="text-nowrap">
                <i onclick="callEdit(this)" id="edit-student-data-btn-${index}" class="bi me-3 text-primary bi-pencil-square" data-bs-toggle="modal" data-bs-target="#myModal" data-id=${index}></i>
                <i id="delete-student-data-btn-${index}" class="bi text-danger bi-trash3"></i>
            </td>
        `;

            // ! append the row
            resultTable.appendChild(row);

            const deleteBtn = document.getElementById(
                `delete-student-data-btn-${index}`
            );

            deleteBtn.addEventListener("click", () => {
                const rowNo = deleteBtn.id.split("-").pop();

                delete prevData[`student-${rowNo}`];
                deletedRows++;

                localStorage.setItem("data", JSON.stringify(prevData));
                const rowToRemove = document.getElementById(`student-${rowNo}`);
                rowToRemove.remove();

                index--;
            });
            index++;
        }
    } else {
        resultTable.innerHTML = `
        <tr>
            <td colspan='7' class='text-center'>
                No data to show
            </td>
        </tr>
        `;
    }
};
window.onload = () => {
    form.reset();
    isEducationValidForm();
    isValidForm();
    loadNewData();
};

function getErrorMessage(input) {
    switch (input.id) {
        case "fname":
            return (!isValidFname(input.value)) ? "Please enter a valid name." : null;
        case "lname":
            return (!isValidLname(input.value)) ? "Please enter a valid name." : null;
        case "dob":
            return (!isValidDateOfBirth(input.value)) ? "Your age must be more than 18." : null;
        case "email":
            return (!isValidEmail(input.value)) ? "Please enter a valid email." : null;
        case "address":
            return (!isValidAddress(input.value)) ? "Address must be more than 5 words." : null;
        case "gyear":
            return (!isValidGraduationYear(input.value)) ? "Please enter a valid graduation year." : null;
        default:
            return null;
    }
}

function getEducationErrorMessage(input, index) {
    switch (input.id) {
        case `degreeOrBoard${index}`:
            return (!isValidDegreeOrBoard(input.value)) ? "Please enter a valid degree or board." : null;
        case `schoolOrCollege${index}`:
            return (!isValidSchoolOrCollege(input.value)) ? "Please enter a valid school or college name." : null;
        case `sdate${index}`:
            return (!isValidStartDate(input.value)) ? "Please enter a valid start date." : null;
        case `passYear${index}`:
            const startDate = document.getElementById(`sdate${index}`).value;
            return (!isValidPassoutYear(input.value, startDate)) ? "Please enter a valid passout year." : null;
        case `percentage${index}`:
            return (!isValidPercentage(input.value)) ? "Please enter a valid percentage." : null;
        case `backlog${index}`:
            return (!isValidBacklog(input.value)) ? "Please enter a valid backlog status." : null;
        default:
            return null;
    }
}


const isEducationValidForm = () => {
    let isValid = true;
    const rows = document.querySelectorAll("#input-container > .row");

    rows.forEach((row, index) => {
        // ? skip index=0 [heading]
        if (index !== 0) {
            const degreeOrBoard = document.getElementById(`degreeOrBoard${index}`).value;
            const schoolOrCollege = document.getElementById(`schoolOrCollege${index}`).value;
            const startDate = document.getElementById(`sdate${index}`).value;
            const passoutYear = document.getElementById(`passYear${index}`).value;
            const percentage = document.getElementById(`percentage${index}`).value;
            const backlog = document.getElementById(`backlog${index}`).value;

            if (!isValidDegreeOrBoard(degreeOrBoard) ||
                !isValidSchoolOrCollege(schoolOrCollege) ||
                !isValidStartDate(startDate) ||
                !isValidPassoutYear(passoutYear, startDate) ||
                !isValidPercentage(percentage) ||
                !isValidBacklog(backlog)) {
                isValid = false;
            }

            const inputs = form.elements;
            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];

                switch (input.id) {
                    case `degreeOrBoard${index}`:
                    case `schoolOrCollege${index}`:
                    case `sdate${index}`:
                    case `passYear${index}`:
                    case `percentage${index}`:
                    case `backlog${index}`:
                        const errorMessage = getEducationErrorMessage(input, index);

                        if (isEmpty(input.value) || errorMessage) {
                            document.getElementById(`error-${input.id}`).innerHTML = errorMessage || "This field is required.";
                            input.classList.remove("is-valid");
                            input.classList.add("is-invalid");
                        } else {
                            input.classList.add("is-valid");
                            input.classList.remove("is-invalid");
                        }
                        break;
                    default:
                        break;
                }
            }

        }
    });

    return isValid;
};

const isValidForm = () => {
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const gyear = document.getElementById("gyear").value;

    const isValid =
        fname !== "" &&
        form.checkValidity() &&
        isValidEmail(email) &&
        isValidDateOfBirth(dob) &&
        isValidGraduationYear(gyear) &&
        isValidAddress(address);

    const inputs = form.elements;
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        switch (input.id) {
            case "fname":
            case "lname":
            case "dob":
            case "email":
            case "address":
            case "gyear":
                const errorMessage = getErrorMessage(input);
                if (isEmpty(input.value) || errorMessage) {
                    document.getElementById(`${input.id}-error`).innerHTML = errorMessage || "This field is required.";
                    input.classList.remove("is-valid");
                    input.classList.add("is-invalid");
                } else {
                    input.classList.add("is-valid");
                    input.classList.remove("is-invalid");
                }
                break;
            default:
                break;
        }
    }

    return isValid;
};

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


const updateStudentData = (e) => {
    e.preventDefault();

    const studentKey = `student-${trRowNo}`;
    const student = prevData[studentKey];

    if (student) {
        const prevStudentFname = student.first_name;
        const prevStudentLname = student.last_name;
        const prevStudentDOB = student.date_of_birth;
        const prevStudentEmail = student.email;
        const prevStudentAddress = student.address;
        const prevStudentGyear = student.graduation_year;

        const prevStudentData = [
            prevStudentFname,
            prevStudentLname,
            prevStudentDOB,
            prevStudentEmail,
            prevStudentAddress,
            prevStudentGyear,
        ];

        const newStudentFname = document.getElementById("fname").value;
        const newStudentLname = document.getElementById("lname").value;
        const newStudentDOB = convertToLocaleDateString(
            new Date(document.getElementById("dob").value)
        );
        const newStudentEmail = document.getElementById("email").value;
        const newStudentAddress = document.getElementById("address").value;
        const newStudentGyear = convertToLocaleDateStringMonth(
            new Date(document.getElementById("gyear").value)
        );

        const newStudentData = [
            newStudentFname,
            newStudentLname,
            newStudentDOB,
            newStudentEmail,
            newStudentAddress,
            newStudentGyear,
        ];

        let updated = false;

        if (isValidForm()) {
            for (let i = 0; i < prevStudentData.length; i++) {
                if (prevStudentData[i] !== newStudentData[i]) {
                    switch (i) {
                        case 0:
                            student.first_name = newStudentFname;
                            break;
                        case 1:
                            student.last_name = newStudentLname;
                            break;
                        case 2:
                            student.date_of_birth = newStudentDOB;
                            break;
                        case 3:
                            student.email = newStudentEmail;
                            break;
                        case 4:
                            student.address = newStudentAddress;
                            break;
                        case 5:
                            student.graduation_year = newStudentGyear;
                            break;
                        default:
                            break;
                    }
                    updated = true;
                }
            }
            document.getElementById("btn-close").click();
            document.getElementById("education-form").style.display = "block";
        } else {
            alert("Invalid form details.")
        }

        if (updated) {
            localStorage.setItem("data", JSON.stringify(prevData));
            loadNewData();
        }
    }
};

// ! dynamically add validation on input change
addInputEventListeners()

form.addEventListener("submit", addNewStudentData);

addBtn.addEventListener("click", () => {
    const newRow = document.createElement("div");

    // ! classes
    newRow.classList.add("row");
    newRow.classList.add("py-2");

    // ! id
    newRow.id = `row-${count}`;

    newRow.innerHTML = `
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="degreeOrBoard${count}">Degree/Board</label>
            <input class="form-control" type="text" name="degreeOrBoard${count}" id="degreeOrBoard${count}" placeholder="Degree/Board" />
            <div class="invalid-feedback" id="error-degreeOrBoard${count}"></div>  
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="schoolOrCollege${count}">School/College</label>
            <input class="form-control" type="text" name="schoolOrCollege${count}" id="schoolOrCollege${count}" placeholder="School/College" />
            <div class="invalid-feedback" id="error-schoolOrCollege${count}"></div>
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="sdate${count}">Start Date</label>
            <input class="form-control" type="month" name="sdate${count}" id="sdate${count}" />
            <div class="invalid-feedback" id="error-sdate${count}"></div>
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="passYear${count}">Passout Year</label>
            <input class="form-control" type="month" name="passYear${count}" id="passYear${count}" />
            <div class="invalid-feedback" id="error-passYear${count}"></div>
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="percentage${count}">Percentage</label>
            <input class="form-control" type="text" name="percentage${count}" id="percentage${count}" placeholder="Percentage" />
            <div class="invalid-feedback" id="error-percentage${count}"></div>
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="backlog${count}">Backlog</label>
            <input class="form-control" min="0" max="30" type="number" name="backlog${count}" id="backlog${count}" placeholder="Backlog" />
            <div class="invalid-feedback" id="error-backlog${count}"></div>
        </div>
        <div class="d-flex justify-content-center align-items-center my-3 mb-lg-0">
            <button type="button" id="remove-row-btn-${count}" class="btn btn-danger">
                Delete
            </button>
        </div>
        <hr class="mt-4">
    `;

    // ? append new row to the conatiner
    container.appendChild(newRow);
    isEducationValidForm()
    addInputEventListeners()
    // ! delete row logic
    const removeBtn = document.getElementById(`remove-row-btn-${count}`);
    const thisRow = document.getElementById(`row-${count}`);

    console.log(`added: row-${count}`)
    removeBtn.addEventListener("click", () => {
        thisRow.remove()
        count--;
        console.log(`deleted: row-${count}`)
    });

    count++;
});
