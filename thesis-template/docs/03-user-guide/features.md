<!-- prev: index.md | next: faq.md -->

# Features Walkthrough

## Registration and Login

Open the application and choose registration or login. Enter email and password. The password field includes a visibility toggle for easier input checking. After successful login, the application stores the session token and redirects the user to the main area.

Expected result: the user can access protected pages such as templates, dashboard, profile, and analytics.

## Creating a Form Template

1. Open the Templates area.
2. Choose to create a new template.
3. Enter title, description, topic, and tags.
4. Choose whether the form should be public.
5. Add questions.
6. For choice-based questions, enter answer options.
7. Optionally enter the correct answer.
8. Save the template.

Supported question types:

- single-line text;
- multi-line text;
- integer/number;
- checkbox;
- single choice;
- multiple choice.

## Managing Forms

The template list supports direct actions:

- Edit: opens the form builder in edit mode.
- Delete: removes the template and related data.
- Make public: allows guest access.
- Make private: cancels public access if the owner no longer wants to share the form.

## Filling Forms

Authenticated users can fill available templates. Guests can fill only public templates. The public endpoint does not expose correct answers, so respondents cannot inspect scoring data from the public form response.

## Reviewing Responses

Open a template from the Templates page to see submitted responses. A response can be opened for detailed review. If a question has a correct answer configured, the interface shows whether the stored answer is correct or incorrect.

## Form Answer Analytics

The response page shows form-level analytics:

- total responses;
- total answers;
- correct answers;
- incorrect answers;
- accuracy per question;
- counts for selected options.

## Live Analytics Dashboard

The live analytics dashboard shows near real-time platform activity. It updates through SSE when templates are created, templates are updated, or responses are submitted.

## Admin Panel

Administrators can view users and change user roles. This supports the role-based access model required by the platform.
