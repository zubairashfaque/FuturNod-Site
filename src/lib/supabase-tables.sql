-- Create the tables shown in the Supabase dashboard image

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES authors(id),
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  category_id UUID REFERENCES blog_categories(id),
  featured_image TEXT,
  read_time INTEGER
);

-- Create blog_posts_tags junction table
CREATE TABLE IF NOT EXISTS blog_posts_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  budget TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'new'
);

-- Create usecases table
CREATE TABLE IF NOT EXISTS usecases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data

-- Sample authors
INSERT INTO authors (name, avatar) VALUES
('John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe'),
('Jane Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=janesmith');

-- Sample blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('AI', 'ai', 'Articles about artificial intelligence'),
('Technology', 'technology', 'Latest technology trends'),
('Business', 'business', 'Business insights and strategies');

-- Sample blog tags
INSERT INTO blog_tags (name, slug) VALUES
('Machine Learning', 'machine-learning'),
('Web Development', 'web-development'),
('Startups', 'startups'),
('Innovation', 'innovation');

-- Sample contact submissions (as shown in the image)
INSERT INTO contact_submissions (id, name, email, phone, website, budget, company, message, created_at, status) VALUES
('67db1099-0b9b-4732-84ab-ad6643f7d98e', 'Omair Ashfaque', 'mianashfaque@gmail.com', '+92301848035', 'Mobilink', '10000', NULL, 'Sample message content', NOW(), 'new'),
('eadf39ae-e079-4aad-a833-782455169f8b', 'zubair ashfaque', 'mianashfaque@gmail.com', '+923018480350', 'dfgdf', '30', NULL, 'Sample message content', NOW(), 'new');

-- Sample admin user
INSERT INTO admin_users (username, password, role) VALUES
('admin', 'admin123', 'admin');

-- Sample blog posts
DO $$ 
DECLARE
  author1_id UUID;
  author2_id UUID;
  category1_id UUID;
  category2_id UUID;
  post1_id UUID;
  post2_id UUID;
  tag1_id UUID;
  tag2_id UUID;
  tag3_id UUID;
BEGIN
  SELECT id INTO author1_id FROM authors WHERE name = 'John Doe' LIMIT 1;
  SELECT id INTO author2_id FROM authors WHERE name = 'Jane Smith' LIMIT 1;
  SELECT id INTO category1_id FROM blog_categories WHERE slug = 'ai' LIMIT 1;
  SELECT id INTO category2_id FROM blog_categories WHERE slug = 'technology' LIMIT 1;
  SELECT id INTO tag1_id FROM blog_tags WHERE slug = 'machine-learning' LIMIT 1;
  SELECT id INTO tag2_id FROM blog_tags WHERE slug = 'web-development' LIMIT 1;
  SELECT id INTO tag3_id FROM blog_tags WHERE slug = 'innovation' LIMIT 1;
  
  -- Insert blog posts
  INSERT INTO blog_posts (title, slug, excerpt, content, author_id, published_at, updated_at, created_at, status, category_id, featured_image, read_time)
  VALUES (
    'Getting Started with AI', 
    'getting-started-with-ai',
    'A beginner-friendly introduction to artificial intelligence concepts.',
    'This is the full content of the blog post about getting started with AI. It includes multiple paragraphs of information about AI basics, machine learning fundamentals, and practical applications.',
    author1_id,
    NOW(),
    NOW(),
    NOW(),
    'published',
    category1_id,
    'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80',
    5
  ) RETURNING id INTO post1_id;
  
  INSERT INTO blog_posts (title, slug, excerpt, content, author_id, published_at, updated_at, created_at, status, category_id, featured_image, read_time)
  VALUES (
    'Web Development Trends 2023', 
    'web-development-trends-2023',
    'Explore the latest trends shaping the future of web development.',
    'This is the full content of the blog post about web development trends in 2023. It covers topics like serverless architecture, JAMstack, headless CMS, and other modern web development approaches.',
    author2_id,
    NULL,
    NOW(),
    NOW(),
    'draft',
    category2_id,
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    8
  ) RETURNING id INTO post2_id;
  
  -- Connect posts to tags
  INSERT INTO blog_posts_tags (post_id, tag_id) VALUES
  (post1_id, tag1_id),
  (post1_id, tag3_id),
  (post2_id, tag2_id),
  (post2_id, tag3_id);
  
  -- Sample use cases
  INSERT INTO usecases (title, description, content, industry, category, image_url, status)
  VALUES
  ('AI-Powered Customer Support', 
   'Automating customer service with intelligent chatbots', 
   'This use case demonstrates how our AI solution helped a major retail company automate 70% of their customer support inquiries using advanced natural language processing and machine learning algorithms.',
   'Retail',
   'Customer Service',
   'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=800&q=80',
   'published'),
   
  ('Financial Document Processing', 
   'Automated extraction and analysis of financial documents',
   'Our solution helped a banking institution automate the processing of thousands of financial documents daily, reducing processing time by 85% and improving accuracy to 99.2%.',
   'Banking',
   'Process Automation',
   'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
   'published'),
   
  ('Healthcare Patient Journey', 
   'Streamlining patient care with AI-powered workflows',
   'This case study explores how our platform helped a healthcare provider improve patient outcomes by 32% through intelligent care pathway automation and predictive analytics.',
   'Healthcare',
   'Workflow Optimization',
   'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
   'draft');
   
END $$;
