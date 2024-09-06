const oldJSON = {
    "first_name": "aa",
    "last_name": "aa",
    "date_of_birth": "05/04/4",
    "email": "4@a.a",
    "address": "454",
    "graduation_year": "05/04/4",
    "education": [
        {
            "degreeOrBoard": "454",
            "schoolOrCollege": "54",
            "sdate": "0545-04-05",
            "passYear": "0004-04-05",
            "percentage": "45",
            "backlog": "54"
        },
        {
            "degreeOrBoard": "545",
            "schoolOrCollege": "78",
            "sdate": "0078-07-08",
            "passYear": "0877-08-07",
            "percentage": "87",
            "backlog": "-0"
        }
    ]
}

const expectedJSON = {
    "student-1": {
        "first_name": "aa",
        "last_name": "aa",
        "date_of_birth": "05/04/4",
        "email": "4@a.a",
        "address": "454",
        "graduation_year": "05/04/4",
        "education": [
            {
                "degreeOrBoard": "454",
                "schoolOrCollege": "54",
                "sdate": "0545-04-05",
                "passYear": "0004-04-05",
                "percentage": "45",
                "backlog": "54"
            },
            {
                "degreeOrBoard": "545",
                "schoolOrCollege": "78",
                "sdate": "0078-07-08",
                "passYear": "0877-08-07",
                "percentage": "87",
                "backlog": "-0"
            }
        ]
    },
    "student-2": {
        "first_name": "aa",
        "last_name": "aa",
        "date_of_birth": "05/04/4",
        "email": "4@a.a",
        "address": "454",
        "graduation_year": "05/04/4",
        "education": [
            {
                "degreeOrBoard": "454",
                "schoolOrCollege": "54",
                "sdate": "0545-04-05",
                "passYear": "0004-04-05",
                "percentage": "45",
                "backlog": "54"
            },
            {
                "degreeOrBoard": "545",
                "schoolOrCollege": "78",
                "sdate": "0078-07-08",
                "passYear": "0877-08-07",
                "percentage": "87",
                "backlog": "-0"
            }
        ]
    },
}
