const form = $('#student-form');
const addBtn = $("#add-row-btn");
const btn = $('button[type="submit"]');
let table;
let prevData = {};
let educationDataCount = 3;
let studentCounter = 0;
let studentDataToEdit = null;

// ? on modal close 
$('#btn-close').on('click', function () {
    $('#student-form')[0].reset();
    form.off('submit', updateStudentData);
    form.on("submit", addNewStudentData);
    setTimeout(() => {
        // ! remove bs5 validation classes from student form
        [
            $("#fname")[0],
            $("#lname")[0],
            $("#dob")[0],
            $("#email")[0],
            $("#address")[0],
            $("#gyear")[0]
        ].forEach((input) => {
            input.classList.remove("is-valid");
            input.classList.remove("is-invalid");
        });

        // ! remove added rows in form
        const rows = $("#input-container > .row");

        for (let i = 1; i < rows.length; i++) {
            switch (i) {
                // ? skip 1st and 2nd row, remove rest
                case 1:
                    break;
                case 2:
                    break;
                default: rows[i].remove();
            }
        }

        // ! remove bs5 validation classes from education form
        const educationInputs = $("#input-container > .row > div > input");

        educationInputs.each(function () {
            $(this).removeClass("is-valid");
            $(this).removeClass("is-invalid");
        });

        $('#education-form')[0].style.display = "block";

        if (btn.text().trim() === "Update") {
            btn.text("Submit");
        }
    }, 500);
})

function lengthOfObject(obj) {
    return Object.keys(obj).length;
};

function reloadTable() {
    // ? clear current (old) table
    // ? add rows (which accepts array)
    table.clear().rows.add(Object.values(prevData));

    // ? re-draw [re-render] the table
    table.draw();
}
// ? add eventlistener on input dynamically, for form validations
function addInputEventListeners() {
    const inputs = form[0].elements;
    for (let i = 0; i < inputs.length; i++) {
        switch (inputs[i].id) {
            // ! student form
            case "fname":
            case "lname":
            case "dob":
            case "email":
            case "address":
            case "gyear":
                inputs[i].addEventListener("input", isValidForm);
                break;
            // ! skip unnecessary stuff
            case "add-row-btn":
                break;
            case `remove-row-btn`:
                break;
            case "": break;

            // ! education form
            default:
                if (!inputs[i].id.startsWith("remove-row-btn-")) {
                    inputs[i].addEventListener("input", isEducationValidForm);
                }
                break;
        }
    }
}

// ! student details validation functions

function isEmpty(value) {
    return value.trim() === "";
};

function isValidFname(name) {
    const nameRegex = /^[a-zA-Z]{1,10}$/
    return nameRegex.test(name);
}
function isValidLname(lname) {
    const nameRegex = /^[a-zA-Z]{1,10}$/
    return nameRegex.test(lname);
}

function isValidDateOfBirth(date) {
    const currentDate = new Date();
    date = new Date(date);

    // ? Date of birth should not be in the future
    if (date > currentDate) {
        return false;
    }

    // ? Date should be at least 18 years before the current date
    const minAgeDate = new Date(currentDate);
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

    if (date >= minAgeDate) {
        return false;
    }

    // ? Date should not be earlier than the current year
    if (date.getFullYear() < currentDate.getFullYear() - 100) {
        return false;
    }

    return true;
}


function isValidGraduationYear(date) {
    const currentDate = new Date();
    date = new Date(date);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const gradYear = date.getFullYear();
    const gradMonth = date.getMonth() + 1;

    // ? Date should not be in the past
    if (gradYear < currentYear || (gradYear === currentYear && gradMonth <= currentMonth)) {
        return false;
    }

    // ? Date can be in the future but not more than 10 years from current date
    const maxAllowedYear = currentYear + 10;
    const maxAllowedMonth = currentMonth;
    if (gradYear > maxAllowedYear || (gradYear === maxAllowedYear && gradMonth > maxAllowedMonth)) {
        return false;
    }

    return true;
};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function isValidAddress(address) {
    return address.trim().split(/\s+/).length > 3;
};

// ! education details validation functions

function isValidDegreeOrBoard(degreeOrBoard) {
    return degreeOrBoard.length <= 15;
}

function isValidSchoolOrCollege(schoolOrCollege) {
    const schoolOrCollegeRegex = /^[A-Za-z0-9\s]*[A-Za-z][A-Za-z0-9\s]*$/;
    return schoolOrCollege.length <= 15 && schoolOrCollegeRegex.test(schoolOrCollege);
}
function isValidStartDate(startDate, dob) {
    const dobDate = new Date(dob);
    const startDateDate = new Date(startDate);
    const tenYearsAfterDob = new Date(dobDate.setFullYear(dobDate.getFullYear() + 5));

    // ? Start date must not be in the future
    const currentDate = new Date();
    if (startDateDate > currentDate) {
        return false;
    }

    return startDateDate >= tenYearsAfterDob;
}

function isValidPassoutYear(passoutYear, startDate) {
    return startDate !== "" &&
        (new Date(passoutYear).getFullYear() - new Date(startDate).getFullYear() >= 1) &&
        (new Date(passoutYear).getFullYear() - new Date(startDate).getFullYear() <= 10);
}

function isValidPercentage(percentage) {
    const percentageRegex = /^\d+(\.\d+)?$/
    return percentageRegex.test(percentage) && parseFloat(percentage) >= 0 && parseFloat(percentage) <= 100;
}


function isValidBacklog(backlog) {
    const backlogRegex = /^\d+$/
    return backlogRegex.test(backlog) && parseInt(backlog) >= 0 && parseInt(backlog) <= 30;
}

// ! date conversions
function convertToLocaleDateStringMonth(date) {
    const formattedDate = date.toLocaleDateString("en-IN", {
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate;
};
function convertToLocaleDateString(date) {
    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate;
};
function convertToGlobalDateFormat(date) {
    const parts = date.split("/");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else if (parts.length === 2) {
        return `${parts[1]}-${parts[0]}`;
    } else {
        return null;
    }
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
            return (!isValidAddress(input.value)) ? "Address must be more than 3 words." : null;
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
            const dob = $('#dob').val();
            return (!isValidStartDate(input.value, dob)) ? "Please enter a valid start date." : null;
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


function isValidForm() {
    const fname = $("#fname").val();
    const lname = $("#lname").val();
    const dob = $("#dob").val();
    const email = $("#email").val();
    const address = $("#address").val();
    const gyear = $("#gyear").val();

    const isValid =
        isValidFname(fname) &&
        isValidLname(lname) &&
        isValidEmail(email) &&
        isValidDateOfBirth(dob) &&
        isValidGraduationYear(gyear) &&
        isValidAddress(address);

    const inputs = form[0].elements;
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
                    $(`#${input.id}-error`).html(`${errorMessage || "This field is required."}`);
                    input.classList.remove("is-valid");
                    input.classList.add("is-invalid");
                    console.log("removed: is-valid")
                    console.log("added: is-invalid")
                } else {
                    input.classList.add("is-valid");
                    input.classList.remove("is-invalid");
                    console.log("added: is-valid")
                    console.log("removed: is-invalid")
                }
                break;
            default:
                break;
        }
    }

    return isValid;
};

function isEducationValidForm() {
    let isValid = true;
    const rows = document.querySelectorAll("#input-container > .row");

    rows.forEach((row, index) => {
        // ? skip index=0 [heading]
        if (index !== 0) {
            const degreeOrBoard = $(`#degreeOrBoard${index}`).val();
            const schoolOrCollege = $(`#schoolOrCollege${index}`).val();
            const startDate = $(`#sdate${index}`).val();
            const passoutYear = $(`#passYear${index}`).val();
            const percentage = $(`#percentage${index}`).val();
            const backlog = $(`#backlog${index}`).val();

            if (!isValidDegreeOrBoard(degreeOrBoard) ||
                !isValidSchoolOrCollege(schoolOrCollege) ||
                !isValidStartDate(startDate, $('#dob').val()) ||  // Pass the date of birth to isValidStartDate
                !isValidPassoutYear(passoutYear, startDate) ||
                !isValidPercentage(percentage) ||
                !isValidBacklog(backlog)) {
                isValid = false;
            }

            const inputs = form[0].elements;
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
                            $(`#error-${input.id}`).html(`${errorMessage || "This field is required."}`)
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

// ! create student
function addNewStudentData(e) {
    e.preventDefault();
    e.stopPropagation();

    const fname = $("#fname").val();
    const lname = $("#lname").val();
    const dob = $("#dob").val();
    const email = $("#email").val();
    const address = $("#address").val();
    const gyear = $("#gyear").val();

    const dob_dateObj = new Date(dob)
    const gyear_dateObj = new Date(gyear)

    const dob_localString = convertToLocaleDateString(dob_dateObj)
    const gyear_localString = convertToLocaleDateStringMonth(gyear_dateObj)

    const studentFormValidity = isValidForm()
    const educationFormValidity = isEducationValidForm()

    if (!studentFormValidity && educationFormValidity) {
        alert("Invalid student details.")
    } else if (studentFormValidity && !educationFormValidity) {
        alert("Invalid education details.")
    } else if (!studentFormValidity && !educationFormValidity) {
        alert("Invalid student and education details.")
    }
    else {
        let educationData = [];

        for (let i = 1; i < educationDataCount; i++) {
            educationData.push({
                degreeOrBoard: $(`#degreeOrBoard${i}`).val(),
                schoolOrCollege: $(`#schoolOrCollege${i}`).val(),
                sdate: $(`#sdate${i}`).val(),
                passYear: $(`#passYear${i}`).val(),
                percentage: $(`#percentage${i}`).val(),
                backlog: $(`#backlog${i}`).val(),
            });
        }

        const studentData = {
            first_name: fname,
            last_name: lname,
            date_of_birth: dob_localString,
            email,
            address,
            graduation_year: gyear_localString,
            education: educationData,
        };

        // ? update prevData (local)
        const timestamp = Date.now();
        prevData[`student-${timestamp}`] = studentData;

        // ! prevData[`student-${studentCounter}`] = studentData;

        // ? update localStorage
        localStorage.setItem("data", JSON.stringify(prevData));
        localStorage.setItem("studentCounter", studentCounter);

        // ? reload the table to reflect updated data
        reloadTable()

        // ? Increment the student counter
        studentCounter++;

        $('#btn-close').click()
    }

};
form.on('submit', addNewStudentData)

// ! update student
function updateStudentData(e) {
    e.preventDefault();
    const newStudentFname = $('#fname').val();
    const newStudentLname = $('#lname').val();
    const newStudentDOB = convertToLocaleDateString(new Date($('#dob').val()));
    const newStudentEmail = $('#email').val();
    const newStudentAddress = $('#address').val();
    const newStudentGyear = convertToLocaleDateStringMonth(new Date($('#gyear').val()));

    const newStudentData = [
        newStudentFname,
        newStudentLname,
        newStudentDOB,
        newStudentEmail,
        newStudentAddress,
        newStudentGyear
    ];

    let prevStudentFname = studentDataToEdit.first_name;
    let prevStudentLname = studentDataToEdit.last_name;
    let prevStudentDOB = studentDataToEdit.date_of_birth;
    let prevStudentEmail = studentDataToEdit.email;
    let prevStudentAddress = studentDataToEdit.address;
    let prevStudentGyear = studentDataToEdit.graduation_year;

    let prevStudentData = [
        prevStudentFname,
        prevStudentLname,
        prevStudentDOB,
        prevStudentEmail,
        prevStudentAddress,
        prevStudentGyear,
    ];

    let updated = false;

    if (isValidForm()) {
        for (let i = 0; i < prevStudentData.length; i++) {
            if (prevStudentData[i] !== newStudentData[i]) {

                // ? directly modifying the object in memory that studentDataToEdit, studentData, 
                // ? and the corresponding entry in prevData all reference. 
                // ? There's no need to explicitly update prevData with the new values because 
                // ! prevData already holds a reference to the modified object.

                switch (i) {
                    case 0:
                        studentDataToEdit.first_name = newStudentFname;
                        break;
                    case 1:
                        studentDataToEdit.last_name = newStudentLname;
                        break;
                    case 2:
                        studentDataToEdit.date_of_birth = newStudentDOB;
                        break;
                    case 3:
                        studentDataToEdit.email = newStudentEmail;
                        break;
                    case 4:
                        studentDataToEdit.address = newStudentAddress;
                        break;
                    case 5:
                        studentDataToEdit.graduation_year = newStudentGyear;
                        break;
                    default:
                        break;
                }
                updated = true;
            }
        }
        $("#btn-close").click();
    } else {
        alert("Invalid form details.")
    }

    if (updated) {
        localStorage.setItem("data", JSON.stringify(prevData));
        reloadTable();
    }
}

addBtn.on('click', function () {
    $('#input-container').append(
        `<div class="row py-2" id="row-${educationDataCount}">
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="degreeOrBoard${educationDataCount}">Degree/Board</label>
            <input class="form-control" type="text" name="degreeOrBoard${educationDataCount}" id="degreeOrBoard${educationDataCount}" placeholder="Degree/Board" />
            <div class="invalid-feedback" id="error-degreeOrBoard${educationDataCount}"></div>  
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="schoolOrCollege${educationDataCount}">School/College</label>
            <input class="form-control" type="text" name="schoolOrCollege${educationDataCount}" id="schoolOrCollege${educationDataCount}" placeholder="School/College" />
            <div class="invalid-feedback" id="error-schoolOrCollege${educationDataCount}"></div>
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="sdate${educationDataCount}">Start Date</label>
            <input class="form-control" type="month" name="sdate${educationDataCount}" id="sdate${educationDataCount}" />
            <div class="invalid-feedback" id="error-sdate${educationDataCount}"></div>
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="passYear${educationDataCount}">Passout Year</label>
            <input class="form-control" type="month" name="passYear${educationDataCount}" id="passYear${educationDataCount}" />
            <div class="invalid-feedback" id="error-passYear${educationDataCount}"></div>
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="percentage${educationDataCount}">Percentage</label>
            <input class="form-control" type="number" min="0" max="100" name="percentage${educationDataCount}" id="percentage${educationDataCount}" placeholder="Percentage" />
            <div class="invalid-feedback" id="error-percentage${educationDataCount}"></div>
        </div>
        <div class="col-lg-2 mb-3 mb-lg-0 px-2 px-xl-4 d-flex flex-column">
            <label class="form-label mb-1 d-block d-lg-none" for="backlog${educationDataCount}">Backlog</label>
            <input class="form-control" min="0" max="30" type="number" name="backlog${educationDataCount}" id="backlog${educationDataCount}" placeholder="Backlog" />
            <div class="invalid-feedback" id="error-backlog${educationDataCount}"></div>
        </div>
        <div class="d-flex justify-content-center align-items-center my-3 mb-lg-0">
            <button type="button" id="remove-row-btn-${educationDataCount}" class="btn btn-danger">
                Delete
            </button>
        </div>
        <hr class="mt-4">
    </div>`);

    const thisRow = $(`#row-${educationDataCount}`)

    $(`#remove-row-btn-${educationDataCount}`).on('click', function () {
        thisRow[0].remove()
        educationDataCount--;
    })

    educationDataCount++;

    addInputEventListeners()
})

function nestedTable(data) {
    let tableHtml = `
    <table class="table nested-table table-bordered" style="width:100%">
        <thead>
            <tr>
                <th class="text-nowrap">
                    Degree/Board
                </th>
                <th class="text-nowrap">
                    School/College
                </th>
                <th class="text-nowrap">Start Date</th>
                <th class="text-nowrap">Passout Year</th>
                <th class="text-nowrap">Percentage</th>
                <th class="text-nowrap">Backlog</th>
            </tr>
        </thead>
        <tbody>
    `
    data.education.forEach(function (educationData, i) {
        tableHtml += `
            <tr>
                <td>${educationData.degreeOrBoard}</td>
                <td>${educationData.schoolOrCollege}</td>
                <td>${educationData.sdate}</td>
                <td>${educationData.passYear}</td>
                <td>${educationData.percentage}</td>
                <td>${educationData.backlog}</td>
            </tr>
        `
    })

    tableHtml += `</tbody>
                  </table>`;

    return tableHtml;
}

$(document).ready(function () {
    // ! load the previous data
    const dataFromLS = JSON.parse(localStorage.getItem('data'))

    if (dataFromLS && lengthOfObject(dataFromLS) !== 0) {
        prevData = dataFromLS // ? set prevData (global scope)
    }
    studentCounter = parseInt(localStorage.getItem('studentCounter')) || 0;
    form[0].reset();
    addInputEventListeners()

    // ? initialize DataTable
    table = $('#studentTable').DataTable({
        data: Object.values(prevData),
        columns: [
            {
                className: 'details-control',
                orderable: false,
                data: null,
                render: function () {
                    return '<i class="bi bi-caret-down-fill"></i>';
                },
                width: '15px'
            },
            { data: null, render: function (data, type, row, meta) { return meta.row + 1; } },
            { data: 'first_name' },
            { data: 'last_name' },
            { data: 'date_of_birth' },
            { data: 'email' },
            { data: 'address' },
            { data: 'graduation_year' },
            {
                data: null, render: function () {
                    return '<i class="bi me-3 text-primary bi-pencil-square"></i>' +
                        '<i class="bi text-danger bi-trash3"></i>'
                }
            }
        ],
        order: [[1, 'asc']]
    });
    // ! nested education details
    $('#studentTable').on('click', 'td.details-control', function () {
        var clickedRow = $(this).parents('tr');
        var row = table.row(clickedRow);

        // ! row object has child, which has functions like 
        // ! isShown(), hide(), remove(), show()
        // console.log(row)

        if (row.child.isShown()) {
            // ? if table is expanded [child is shown], hide it [hide()] with animation
            row.child.hide();

            clickedRow[0].classList.remove('table-active') // ? unset active row

            // ? toggle icons
            const iTag = clickedRow.find('i')
            iTag.removeClass('bi-caret-up-fill')
            iTag.addClass('bi-caret-down-fill');
        } else {
            const data = row.data()

            // ? if table is not expanded, expand it [show()] with the data and animation
            row.child(nestedTable(data)).show();

            clickedRow[0].classList.add('table-active') // ? set active row

            $('.nested-table').DataTable() // ? make nested table a DataTable

            // ? toggle icons
            const iTag = clickedRow.find('i')
            iTag.removeClass('bi-caret-down-fill')
            iTag.addClass('bi-caret-up-fill');
        }
    });

    // ! edit student
    $('#studentTable').on('click', '.bi-pencil-square', function () {
        $('button[type="submit"]').text("Update")

        $('#education-form')[0].style.display = "none";
        // ? detect which element [<i>] is clicked
        const clickedRow = $(this).parents('tr')

        // ? get the table row
        const row = table.row(clickedRow);

        // ? get the data from row
        const studentData = row.data();

        $('#fname').val(studentData.first_name);
        $('#lname').val(studentData.last_name);
        $('#dob').val(convertToGlobalDateFormat(studentData.date_of_birth));
        $('#email').val(studentData.email);
        $('#address').val(studentData.address);
        $('#gyear').val(convertToGlobalDateFormat(studentData.graduation_year));


        // ! 1. Both studentData and studentDataToEdit now reference the same object in memory.
        // ! This object is also a part of your prevData object since studentData was originally 
        // ! retrieved from prevData.

        studentDataToEdit = studentData

        form.off("submit", addNewStudentData);
        form.on("submit", updateStudentData);

        $('#myModal').modal('show');
    });

    // ! delete student
    $('#studentTable').on('click', '.bi-trash3', function () {
        if (confirm("Are you sure you want to delete this student?")) {
            // ? detect which element [<i>] is clicked
            const clickedRow = $(this).parents('tr')

            // ? get the table row
            // ! When you call row.data(), DataTable returns a reference to the original 
            // ! data object that was used to create the row.
            const row = table.row(clickedRow);

            // ? get the data from row
            const studentData = row.data();

            // ! get student id
            const studentID = Object.keys(prevData).find(key => prevData[key] === studentData);

            // ? delete from prevData
            delete prevData[studentID];

            // ? update localStorage
            localStorage.setItem("data", JSON.stringify(prevData));

            // ? reload table to reflect changes (new indexing)
            reloadTable()
        }
    });
});
