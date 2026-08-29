# Limra Command Center

==================================================

35. FULL ADMIN PANEL / CMS

==================================================

IMPORTANT:

Build a secure, professional ADMIN PANEL / CMS for the Limra Academy website.

The admin panel must allow a non-technical administrator to manage the entire website without editing code.

The public website and admin panel must be connected to the same database/backend.

The admin must be able to ADD, EDIT, DELETE, REORDER, PUBLISH and UNPUBLISH website content.

Do NOT hard-code content that the admin should be able to change.

==================================================

ADMIN LOGIN

==================================================

Create:

/admin

Secure admin login with:

• Email

• Password

• Logout

• Forgot password

• Protected admin routes

• Session management

• Authentication

• Authorization

Only authenticated administrators can access the dashboard.

Never expose admin credentials in frontend code.

==================================================

ADMIN DASHBOARD

==================================================

Create a modern dashboard showing:

Total Programs

Total Trainers

Total Institutions

Total Countries

Total Gallery Images

Total Testimonials

Total Workshop Enquiries

Also show:

Recent Enquiries

Recent Content Updates

Quick Actions

Quick action buttons:

+ Add Trainer

+ Add Program

+ Add Institution

+ Upload Image

+ Add Testimonial

+ Add Country

The dashboard should be clean, fast and easy to use.

==================================================

1. HOMEPAGE CONTENT MANAGEMENT

==================================================

Create an admin section:

Homepage Management

Admin can edit:

• Hero headline

• Hero subtitle

• Hero background image/video

• Hero CTA text

• Hero CTA link

• Secondary CTA

• About section heading

• About section content

• Impact statistics

• Program section

• Why Limra section

• International reach section

• Featured trainers

• Featured institutions

• Gallery section

• Testimonials

• Final CTA

• Footer content

Admin should be able to turn individual homepage sections ON/OFF.

For example:

[✓] Show Impact Statistics

[✓] Show Programs

[✓] Show Trainers

[✓] Show Gallery

[ ] Show Testimonials

Do not require coding for these changes.

==================================================

2. IMAGE / MEDIA LIBRARY

==================================================

Create a complete Media Library.

Admin can:

• Upload images

• Upload multiple images

• Drag and drop images

• Preview images

• Replace images

• Delete images

• Search images

• Filter images

• Create folders/categories

• Add image title

• Add alt text

• Add caption

• Select existing images

• Reuse an image in multiple sections

Supported image formats:

JPG

JPEG

PNG

WEBP

SVG where safe and appropriate

Optimize uploaded images automatically where possible.

Generate responsive image sizes/thumbnails.

Do not unnecessarily duplicate the same image.

Media categories:

• Student Workshops

• Teacher Training

• Corporate Training

• International Training

• Trainers

• Institutions

• Homepage

• General

IMPORTANT:

The website must use real uploaded Limra photographs when available.

Do not automatically replace uploaded photographs with AI-generated photographs.

==================================================

3. TRAINERS MANAGEMENT

==================================================

Create:

Trainers

Admin can:

+ Add Trainer

Edit Trainer

Delete Trainer

Publish/Unpublish Trainer

Reorder Trainers

Fields:

Name

Professional Title

Qualification

Position

Short Biography

Full Biography

Profile Photo

Additional Photos

Training Areas

Countries / Regions

Email (optional)

Phone (optional)

LinkedIn URL (optional)

Display Order

Featured: Yes/No

Published: Yes/No

Example trainers:

Dr. K. Akbar Hussain

Dr. J. Lazarus

Dr. A. Sendhil Kumar

Dr. Magdalena

Mr. Akif Hussain

Ms. Mekala

IMPORTANT:

Do not invent trainer qualifications or biographies.

The administrator must be able to add completely new trainers later.

For example:

+ Add New Trainer

This should automatically make the trainer available on the public Trainers page if Published = Yes.

==================================================

4. PROGRAMS MANAGEMENT

==================================================

Create:

Programs

Admin can:

+ Add Program

Edit

Delete

Duplicate

Publish/Unpublish

Reorder

Fields:

Program Name

Short Description

Full Description

Target Audience

Duration

Workshop Format

Training Topics

Program Image

Gallery Images

Trainer(s)

Country Availability

CTA Text

CTA Link

Featured

Published

Examples:

Train the Brain

Effective Teaching Skills

Corporate Training

Admin must be able to add completely new programs later.

Example:

+ Add New Program

No coding required.

==================================================

5. TRAINING TOPICS MANAGEMENT

==================================================

Create a reusable Training Topics system.

Admin can add:

Topic Name

Description

Icon

Category

Display Order

Published

Examples:

Concentration Techniques

Super Memory

Communication Skills

Leadership Skills

Body Language

Brain Gym

Creative Thinking

Team Building

Stress Management

Topics should be selectable when creating/editing a program.

==================================================

6. INSTITUTIONS / SCHOOLS / COLLEGES / UNIVERSITIES

==================================================

Create:

Institutions Management

This is very important.

The administrator must be able to add:

• Schools

• Colleges

• Universities

• Corporate organizations

• Other institutions

Admin can:

+ Add Institution

Edit

Delete

Publish/Unpublish

Search

Filter

Reorder

Fields:

Institution Name

Institution Type

Country

State / Region

City

Address

Website URL

Logo

Cover Image

Gallery Images

Training Conducted

Training Category

Year (optional)

Description

Featured

Published

Institution Type dropdown:

School

College

University

Corporate

Other

Country dropdown:

India

Malaysia

Singapore

UAE

Indonesia

Vietnam

Sri Lanka

Other

The public Institutions page should automatically display newly added institutions.

Example:

Admin adds:

Institution Name:

ABC International School

Type:

School

Country:

India

City:

Bangalore

Logo:

[Upload]

Training:

Train the Brain

Published:

Yes

After saving, it automatically appears on the website.

==================================================

7. COUNTRIES / GLOBAL REACH MANAGEMENT

==================================================

Create:

Countries

Admin can add/edit/delete countries.

Fields:

Country Name

Country Code

Flag

Map Marker

Description

Training Count

Featured Image

Institutions

Published

The global map should automatically update when a new country is added.

Do not hard-code the country list into the frontend.

==================================================

8. GALLERY MANAGEMENT

==================================================

Create a professional Gallery CMS.

Admin can:

+ Create Album

+ Upload Images

+ Upload Multiple Images

+ Edit

+ Delete

+ Reorder

+ Publish/Unpublish

Albums:

Student Workshops

Teacher Workshops

Corporate Training

International Training

Events

Trainers

Other

Each image should support:

Title

Caption

Alt Text

Date

Country

City

Category

Featured

Published

Public gallery should automatically update from admin content.

==================================================

9. TESTIMONIAL MANAGEMENT

==================================================

Create:

Testimonials

Admin can add:

Name

Designation

Organization

Country

Profile Photo

Testimonial

Rating (optional)

Program

Published

Featured

Admin must approve testimonials before they appear publicly.

Default:

Published = OFF

Do not create fake testimonials automatically.

==================================================

10. WORKSHOP / EVENT MANAGEMENT

==================================================

Create:

Workshops / Events

Admin can create future or past workshops.

Fields:

Workshop Name

Program

Date

Start Time

End Time

Location

Country

City

Institution

Trainer

Description

Event Image

Gallery

Registration Link

Status

Status:

Upcoming

Completed

Cancelled

Draft

Create public sections:

Upcoming Workshops

Past Workshops

==================================================

11. ENQUIRY / CONTACT MANAGEMENT

==================================================

All website enquiry form submissions must appear in the admin panel.

Create:

Enquiries

Each enquiry should contain:

Name

Organization

Designation

Email

Phone

WhatsApp

Country

Training Requirement

Preferred Date

Number of Participants

Message

Date Submitted

Status

Status options:

New

Contacted

Follow-up

Converted

Closed

Admin can:

View enquiry

Update status

Add internal notes

Delete enquiry

Dashboard should show:

New Enquiries

Follow-ups

Converted Enquiries

IMPORTANT:

Do not display private enquiry information publicly.

==================================================

12. CONTACT INFORMATION MANAGEMENT

==================================================

Create:

Site Settings → Contact

Admin can edit:

Phone

WhatsApp

Email

Office Address

Countries Served

Business Hours

Social Media Links

The public website should automatically use the updated information.

For example:

If admin changes WhatsApp number,

all WhatsApp buttons should automatically use the new number.

Do not hard-code contact details in multiple components.

==================================================

13. SEO MANAGEMENT

==================================================

Create:

SEO Settings

Admin can edit SEO for every major page.

Fields:

SEO Title

Meta Description

Focus Keyword

Open Graph Image

Canonical URL

Robots Index/No Index

Allow separate SEO settings for:

Homepage

About

Programs

Train the Brain

Teacher Training

Corporate Training

Trainers

Institutions

Global Reach

Gallery

Contact

Generate appropriate structured data where applicable.

==================================================

14. NAVIGATION MANAGEMENT

==================================================

Create:

Navigation Management

Admin can:

• Add menu item

• Rename menu item

• Change URL

• Reorder menu items

• Hide menu item

• Create dropdowns

• Add submenu items

Example:

Programs

    Train the Brain

    Teacher Training

    Corporate Training

Admin should be able to modify navigation without coding.

==================================================

15. FOOTER MANAGEMENT

==================================================

Create:

Footer Management

Admin can edit:

Footer logo

Description

Quick links

Program links

Contact information

Social media links

Copyright text

==================================================

16. CONTENT EDITOR

==================================================

For long-form content, provide a simple rich-text editor.

Admin should be able to:

• Bold

• Italic

• Headings

• Lists

• Links

• Images

• Quotes

• Paragraphs

The editor must be easy for a non-technical user.

Do not require HTML knowledge.

==================================================

17. DRAG & DROP REORDERING

==================================================

Where appropriate, support drag-and-drop ordering.

Examples:

Trainer order

Program order

Gallery order

Homepage sections

Institution order

Testimonials

Changes should save automatically or through a clear Save button.

==================================================

18. DRAFT / PUBLISH SYSTEM

==================================================

Every major content type should support:

Draft

Published

Unpublished

Admin should be able to prepare content without immediately showing it publicly.

Example:

New Trainer:

Draft → Preview → Publish

==================================================

19. PREVIEW BEFORE PUBLISHING

==================================================

Add:

Preview

Before publishing a new:

Trainer

Program

Institution

Gallery

Workshop

Testimonial

Admin should be able to preview how it will appear on the public website.

==================================================

20. DELETE SAFETY

==================================================

Do not immediately permanently delete important content.

For important content:

Delete → Confirmation

Example:

“Are you sure you want to delete this trainer?”

Provide:

Cancel

Delete

Where practical, use soft-delete/archive functionality.

==================================================

21. SEARCH AND FILTERING

==================================================

Admin should be able to search and filter:

Trainers

Programs

Institutions

Countries

Gallery

Testimonials

Workshops

Enquiries

Examples:

Search:

“Akbar”

Filter:

Country = India

Filter:

Institution Type = School

Filter:

Program = Train the Brain

==================================================

22. DATABASE STRUCTURE

==================================================

Use a proper relational backend/database.

Create separate collections/tables for:

users

site_settings

homepage_sections

programs

training_topics

trainers

institutions

countries

gallery_albums

gallery_images

testimonials

workshops

enquiries

navigation

seo_settings

Use relationships between records instead of duplicating information.

For example:

A trainer can be associated with multiple programs.

A program can have multiple trainers.

An institution can host multiple workshops.

A country can contain multiple institutions.

==================================================

23. ADMIN USER ROLES

==================================================

Initially support:

Super Admin

Content Manager

Super Admin:

• Full access

• Manage users

• Manage settings

• Manage all content

• Manage enquiries

Content Manager:

• Manage content

• Manage trainers

• Manage programs

• Manage institutions

• Manage gallery

• Cannot manage admin users/security settings

Build the architecture so more roles can be added later.

==================================================

24. SECURITY

==================================================

Security is critical.

Implement:

• Secure authentication

• Protected admin routes

• Server-side authorization

• Input validation

• File upload validation

• File type restrictions

• File size restrictions

• Secure database rules

• No exposed secret keys

• No credentials in frontend code

• Protection against unauthorized database access

• Secure session handling

Admin APIs must verify authentication and authorization server-side.

Do not rely only on hiding UI buttons for security.

==================================================

25. IMAGE UPLOAD SECURITY

==================================================

For uploaded images:

• Validate file type

• Validate file size

• Generate safe filenames

• Prevent executable uploads

• Store files securely

• Optimize images

• Generate thumbnails

• Store metadata

• Allow replacement

• Allow deletion

The image uploader must provide clear error messages.

Example:

“Image upload failed. Please use JPG, PNG or WebP under 10MB.”

Do not show technical backend errors to normal administrators.

==================================================

26. ADMIN DESIGN

==================================================

Admin panel design should be completely different from the public website.

Public website:

Premium

Elegant

Editorial

International

Admin:

Clean

Functional

Simple

Dashboard-oriented

Use:

Sidebar navigation

Dashboard

Homepage

Programs

Training Topics

Trainers

Institutions

Countries

Gallery

Workshops

Testimonials

Enquiries

Navigation

SEO

Settings

Top bar:

Search

Notifications

Admin profile

Logout

==================================================

27. MOBILE ADMIN

==================================================

Admin panel should also be responsive.

It should work on:

Desktop

Laptop

Tablet

Mobile

However, prioritize desktop/tablet for content management while keeping mobile usable.

==================================================

28. ADMIN ANALYTICS

==================================================

Create a simple dashboard analytics area.

Display:

Total Enquiries

New Enquiries

Converted Enquiries

Programs

Trainers

Institutions

Countries

Gallery Images

If analytics integration is available, allow future integration with Google Analytics / other analytics tools.

Do not invent analytics numbers.

==================================================

29. AUTOMATIC WEBSITE UPDATES

==================================================

IMPORTANT:

The public website must automatically reflect admin changes.

Example:

Admin adds a new trainer.

↓

Trainer saved to database.

↓

Trainer marked Published.

↓

Trainer automatically appears on:

• Trainers page

• Homepage featured trainers if selected

• Related program pages if assigned

No developer intervention should be required.

Same principle for:

Programs

Institutions

Countries

Gallery

Testimonials

Workshops

==================================================

30. CONTENT RELATIONSHIPS

==================================================

Create reusable relationships.

Example:

PROGRAM:

Train the Brain

Associated Trainers:

Dr. K. Akbar Hussain

Dr. J. Lazarus

Associated Audience:

School Students

Associated Countries:

India

Malaysia

Singapore

Associated Gallery:

Train the Brain Album

This should automatically generate related content on the public website.

==================================================

31. ADMIN HELP / EMPTY STATES

==================================================

Make the CMS easy for a first-time administrator.

If there are no trainers:

“No trainers added yet.”

“Add your first trainer.”

Button:

“+ Add Trainer”

If there are no gallery images:

“No gallery images yet.”

“Upload your first workshop image.”

Use helpful empty states.

==================================================

32. BACKUP / DATA SAFETY

==================================================

Design the backend so database content is not lost when the frontend is redesigned.

Keep content separate from presentation.

If supported by the selected backend, provide:

• Database backups

• Storage backups

• Recovery strategy

Do not delete database records when changing website design.

==================================================

33. FINAL ADMIN REQUIREMENT

==================================================

The administrator should be able to launch and maintain the website without Lovable.

After the website is deployed, the admin should be able to:

✓ Add new trainers

✓ Add new doctors/professionals

✓ Add new teachers/trainers

✓ Add new colleges

✓ Add new universities

✓ Add new schools

✓ Add new corporate organizations

✓ Add new countries

✓ Add new programs

✓ Add new workshops

✓ Upload photographs

✓ Replace photographs

✓ Create galleries

✓ Add testimonials

✓ Edit homepage

✓ Edit text

✓ Edit buttons

✓ Change contact details

✓ Manage enquiries

✓ Manage SEO

✓ Manage navigation

✓ Publish/unpublish content

No coding should be required for these tasks.

==================================================

34. CRITICAL ARCHITECTURE RULE

==================================================

DO NOT build a fake admin panel that only changes frontend state.

The admin panel must be connected to a real persistent backend/database and storage system.

When the page is refreshed, data must remain saved.

When the website is deployed, admin changes must persist.

The public website must fetch published content from the backend.

Use secure database access policies.

==================================================

35. BUILD ORDER

==================================================

Build in this order:

PHASE 1

Database + Authentication

PHASE 2

Admin Dashboard

PHASE 3

CMS Content Management

PHASE 4

Media Library

PHASE 5

Public Website

PHASE 6

Connect Public Website to CMS

PHASE 7

Forms + Enquiries

PHASE 8

SEO

PHASE 9

Security

PHASE 10

Responsive Testing

PHASE 11

Performance Optimization

PHASE 12

Final QA

Do not mark the project complete until the public website and admin panel are connected and tested together.

==================================================

36. FINAL ACCEPTANCE TEST

==================================================

Before completing the project, test this exact workflow:

1. Login to /admin

2. Add a new trainer

3. Upload trainer photo

4. Add qualification

5. Publish trainer

6. Open public Trainers page

7. Confirm trainer appears

Then:

1. Add a new institution

2. Upload logo

3. Select country

4. Select institution type

5. Publish

6. Open public Institutions page

7. Confirm it appears

Then:

1. Upload gallery image

2. Add caption

3. Select category

4. Publish

5. Open public Gallery

6. Confirm image appears

Then:

1. Edit homepage hero text

2. Save

3. Open homepage

4. Confirm change appears

Then:

1. Submit contact form

2. Login to admin

3. Open Enquiries

4. Confirm enquiry appears

5. Change status to Contacted

Then test:

• Mobile website

• Desktop website

• Mobile admin

• Desktop admin

• Image uploads

• Authentication

• Logout

• Unauthorized admin access

• Form validation

• Broken image handling

• Empty content states

• Search

• Filters

• Publish/unpublish

Fix all errors before final delivery.  also you can take information and photos from this pdf attached

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f9ac2abd-62d3-4839-9038-08843bda1ab0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
