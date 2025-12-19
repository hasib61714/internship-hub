<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 50px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 36px;
        }
        .emoji {
            font-size: 64px;
            margin-bottom: 10px;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-message {
            text-align: center;
            margin: 30px 0;
        }
        .welcome-message h2 {
            color: #667eea;
            font-size: 28px;
        }
        .features {
            background: white;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
        }
        .feature-item {
            padding: 15px;
            margin: 10px 0;
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            border-radius: 4px;
        }
        .feature-item h4 {
            margin: 0 0 5px 0;
            color: #667eea;
        }
        .feature-item p {
            margin: 0;
            color: #666;
        }
        .button {
            display: inline-block;
            padding: 15px 40px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 18px;
        }
        .button:hover {
            background: #5568d3;
        }
        .steps {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .steps h3 {
            color: #1976d2;
            margin-top: 0;
        }
        .step {
            display: flex;
            align-items: start;
            margin: 15px 0;
        }
        .step-number {
            background: #667eea;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emoji">🎉</div>
            <h1>Welcome to Internship Hub!</h1>
            <p style="font-size: 18px; margin: 10px 0;">Bangladesh's Premier Internship Platform</p>
        </div>
        
        <div class="content">
            <div class="welcome-message">
                <h2>Hello {{ $user->name }}! 👋</h2>
                <p style="font-size: 16px; color: #666;">
                    We're thrilled to have you join our community of talented professionals and forward-thinking companies!
                </p>
            </div>
            
            @if($user->role === 'student')
            <div class="features">
                <h3 style="text-align: center; color: #667eea; margin-top: 0;">🚀 What You Can Do</h3>
                
                <div class="feature-item">
                    <h4>🔍 Browse Thousands of Opportunities</h4>
                    <p>Explore internships, part-time jobs, and full-time positions from top companies</p>
                </div>
                
                <div class="feature-item">
                    <h4>📝 Apply with Your Profile</h4>
                    <p>Create a compelling profile and apply to multiple positions effortlessly</p>
                </div>
                
                <div class="feature-item">
                    <h4>📊 Track Your Applications</h4>
                    <p>Monitor application status and get real-time updates from companies</p>
                </div>
                
                <div class="feature-item">
                    <h4>💾 Save for Later</h4>
                    <p>Bookmark interesting opportunities and apply when you're ready</p>
                </div>
                
                <div class="feature-item">
                    <h4>🎓 Build Your Career</h4>
                    <p>Gain valuable experience and kickstart your professional journey</p>
                </div>
            </div>
            
            <div class="steps">
                <h3>🎯 Get Started in 3 Easy Steps</h3>
                
                <div class="step">
                    <div class="step-number">1</div>
                    <div>
                        <strong>Complete Your Profile</strong><br>
                        <span style="color: #666;">Add your education, skills, and experience to stand out</span>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">2</div>
                    <div>
                        <strong>Browse Jobs</strong><br>
                        <span style="color: #666;">Filter by location, job type, and categories to find perfect matches</span>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">3</div>
                    <div>
                        <strong>Start Applying</strong><br>
                        <span style="color: #666;">Submit applications with cover letters and track your progress</span>
                    </div>
                </div>
            </div>
            
            @else
            <div class="features">
                <h3 style="text-align: center; color: #667eea; margin-top: 0;">🚀 What You Can Do</h3>
                
                <div class="feature-item">
                    <h4>📢 Post Job Opportunities</h4>
                    <p>Share unlimited internships and job openings with qualified students</p>
                </div>
                
                <div class="feature-item">
                    <h4>👥 Find Top Talent</h4>
                    <p>Access a pool of skilled students from universities across Bangladesh</p>
                </div>
                
                <div class="feature-item">
                    <h4>📊 Manage Applications</h4>
                    <p>Review, shortlist, and communicate with applicants efficiently</p>
                </div>
                
                <div class="feature-item">
                    <h4>🏢 Build Your Brand</h4>
                    <p>Showcase your company and attract the best candidates</p>
                </div>
                
                <div class="feature-item">
                    <h4>⚡ Fast Hiring</h4>
                    <p>Connect with candidates quickly and fill positions faster</p>
                </div>
            </div>
            
            <div class="steps">
                <h3>🎯 Get Started in 3 Easy Steps</h3>
                
                <div class="step">
                    <div class="step-number">1</div>
                    <div>
                        <strong>Complete Company Profile</strong><br>
                        <span style="color: #666;">Add company details, logo, and description</span>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">2</div>
                    <div>
                        <strong>Post Your First Job</strong><br>
                        <span style="color: #666;">Create detailed job postings with requirements and benefits</span>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">3</div>
                    <div>
                        <strong>Review Applications</strong><br>
                        <span style="color: #666;">Evaluate candidates and start hiring!</span>
                    </div>
                </div>
            </div>
            @endif
            
            <p style="text-align: center; margin: 40px 0;">
                <a href="{{ config('app.frontend_url') }}/login" class="button">
                    Get Started Now
                </a>
            </p>
            
            <div style="background: #fff9e6; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <p style="margin: 0; color: #856404;">
                    <strong>💡 Pro Tip:</strong> {{ $user->role === 'student' ? 'Complete your profile to 100% to increase your chances of getting hired!' : 'Post your first job within 24 hours to start receiving quality applications!' }}
                </p>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h4 style="margin-top: 0; color: #1976d2;">📧 Stay Updated</h4>
                <p style="margin: 0; color: #666;">
                    You'll receive email notifications for important updates. Make sure to check your inbox regularly!
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p style="font-size: 18px; margin-bottom: 20px;">
                <strong>Need Help Getting Started?</strong>
            </p>
            <p>
                <a href="{{ config('app.frontend_url') }}/contact" style="color: #667eea; text-decoration: none;">Contact Support</a> |
                <a href="{{ config('app.frontend_url') }}/faq" style="color: #667eea; text-decoration: none;">FAQs</a> |
                <a href="{{ config('app.frontend_url') }}/guide" style="color: #667eea; text-decoration: none;">User Guide</a>
            </p>
            
            <div class="social-links">
                <p style="margin-bottom: 10px;"><strong>Follow Us:</strong></p>
                <a href="#" style="margin: 0 5px;">Facebook</a> |
                <a href="#" style="margin: 0 5px;">LinkedIn</a> |
                <a href="#" style="margin: 0 5px;">Twitter</a>
            </div>
            
            <p style="margin-top: 30px;">© {{ date('Y') }} Internship Hub. All rights reserved.</p>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
                You're receiving this email because you registered on Internship Hub.<br>
                If you didn't create this account, please contact our support team.
            </p>
        </div>
    </div>
</body>
</html>