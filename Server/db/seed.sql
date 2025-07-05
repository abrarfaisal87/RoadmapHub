--inserting into roadmap items

INSERT INTO roadmap_item(title,description,status,category) 
VALUES
('Implement Dark mode','Add a dark mode button to the UI','planned','UI'),
('Mobile App Launch', 'Launch the first version of the mobile app.', 'in_progress', 'Feature'),
('Real-Time Notifications', 'Send in-app and email notifications in real-time.', 'planned', 'Backend'),
('Bug Fix: Login Issue', 'Fix session timeout bug after login.', 'completed', 'Bug'),
('Add User Profile Page', 'Display public profile info and user activity.', 'in_progress', 'Feature'),
('Search Functionality', 'Add search bar to find roadmap items by title or tags.', 'planned', 'Feature'),
('Comment Sorting Options', 'Sort comments by recent, popular, or most replies.', 'planned', 'UI');