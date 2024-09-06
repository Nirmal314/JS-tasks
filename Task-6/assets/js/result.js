var studentData;

window.onload = () => {
    studentData = JSON.parse(localStorage.getItem('data'));
    console.log(studentData);

    const resultTable = document.getElementById("result-table");
    resultTable.innerHTML = `
        <tr>
            <th scope="col">
                #
            </th>
            <th class="text-nowrap" scope="col">
                First Name
            </th>
            <th class="text-nowrap" scope="col">
                Last Name
            </th>
            <th class="text-nowrap" scope="col">
                Date of Birth
            </th>
            <th class="text-nowrap" scope="col">
                Email
            </th>
            <th class="text-nowrap" scope="col">
                Address
            </th>
            <th class="text-nowrap" scope="col">
                Graduation Year
            </th>
        </tr>
    `;

    let index = 1;
    for (const student of Object.values(studentData)) {
        let row = document.createElement("tr");
        row.innerHTML = `
            <th scope="row">
                ${index}
            </th>
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
        `;
        resultTable.appendChild(row);
        index++;
    }
}
