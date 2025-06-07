https://trello.com/b/cOqaY8Ad/trabalho-final-pw

# Description

Electricity consumption and generation management software. The aim is to develop an application to support the management of renewable energy generation from solar panels.

## Functional Requirements

-   **Authentication:** User authentication with JWT to allow access to the application\'s functions.
-   **Solar panel installation registration:** Registration of solar panel installations made by customers, including technical data and location. This registration will later be validated by a certified technician who will issue an energy producer certificate to the customer. Certificates must be recorded in the application.
-   **Monitoring of renewable energy generation:** Real-time monitoring of renewable energy generation produced by customers. The reading must be done directly from an API provided by the system installed at the customer\'s premises. This API must be implemented in a separate project (create an endpoint that generates valid random numbers).
-   **Accounting for energy credits:** Energy credits accumulated by customers who generate more energy than they consume must be accounted for, allowing for offsetting on future bills. Monthly, the application must take a reading of the generated energy meter (customer API) and account for the KWs generated since the previous reading. Subsequently, the customer must be informed of this value by email.

## Non-Functional Requirements

-   **Usability:** Intuitive and easy-to-use system for both company employees and customers.
-   **Performance:** Real-time processing of large amounts of data, ensuring a fast and efficient response.
-   **Security:** Security of customer and company data, implementing protection measures against unauthorized access.
-   **Scalability:** Scalability to support a growing number of customers and the integration of new functionalities.
-   **Availability:** 24/7 availability, ensuring continuous access to data and functions.
-   **Compatibility:** Compatibility with different devices and platforms, allowing access via computers, tablets, and smartphones.
-   **Maintainability:** Ease of maintenance, allowing for the correction of errors and the efficient addition of new functionalities.

## Sprint Delivery and Review Rules

-   Tasks presented on the board must be completed by the scheduled dates and presented in the class following delivery (max. 5 min).
-   For each sprint, one of the students in the group must be assigned the role of Product Owner (responsible for the work). The assignment of this role to a student must ensure that, at the end of the semester, students are homogeneously distributed across the sprints.
-   Only group students present at the sprint presentation will receive the evaluation grade.
-   At the end of the sprint, a commit with the new version of the code must be published in the group\'s code repository (Git) (by the Product Owner of the completed sprint) and marked with the message `Sprint n`. The Product Owner of this sprint will be responsible for defending the work in the class following its completion.
-   There may be intermediate commits, although they are not considered for evaluation purposes.

## Final Sprint Delivery

The completed work must be delivered in a single file (ZIP/RAR) containing the project code and a small report with the following structure:

-   **Introduction** — general description of the developed application
-   **Implementation** — explanation of the most important parts of the implemented solution
-   **Conclusion** — analysis of the presented solution, indicating limitations, possible improvements, and functionalities that could be implemented in the future

Delivery must be made on the Moodle platform by the eve of the last practical class. The evaluation of the final sprint will take place in the last practical class (Teaching-Learning) or on a date to be defined (other periods).

## Group Formation

### Description
-   Groups must consist of <= 4 students.
-   The group must be registered on Discord.
    -   [Discord - Group Chat That\'s All Fun & Games](https://discord.com/channels/1058337352768049193/1369597670498242562)

### Github Repository
-   The repository must be private and the practical class instructor must be added to the repository at the beginning of the first evaluation.

## Evaluation Criteria

Evaluation will be carried out weekly in sprints throughout the course. The evaluation of the final sprint will take place in the last practical class of the semester.

### Criteria
The work will be evaluated according to the following criteria:

-   Volume of work produced in class under the supervision of the instructor (10%);
-   Continuous work produced throughout the period in which the work was carried out (20%);
-   Creativity (10%);
-   Capacity to exceed objectives (20%);
-   Code quality (10%);
-   Complexity of the developed work (20%);
-   Report (10%);
-   Defense of the work (a cross-cutting factor to the evaluation).

Each group must present a solution for each of the requirements indicated above and will be responsible for the confidentiality/integrity of their code. Plagiarism of solutions and code implies cancellation of the work.

## FAQ

-   **Can groups be made up of students from different shifts?**
    -   If students are in different shifts, they will not be able to make sprint presentations during practical classes, so this is not practical. 