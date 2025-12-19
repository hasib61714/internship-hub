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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
        }
        .emoji {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px 20px;
        }
        .success-message {
            background: #d4edda;
            border: 2px solid #28a745;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .success-message h3 {
            color: #155724;
            margin-top: 0;
        }
        .job-details {
            background: #f8f9fa;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .job-details h3 {
            margin-top: 0;
            color: #10b981;
        }
        .button {
            display: inline-block;
            padding: 15px 40px;
            background: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 16px;
        }
        .button:hover {
            background: #059669;
        }
        .tips {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .tips h3 {
            color: #1976d2;
            margin-top: 0;
        }
        .tips ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .tips li {
            margin: 8px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emoji">🎉</div>
            <h1>Job Approved!</h1>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{ $job->company->user->name }}</strong>,</p>
            
            <div class="success-message">
                <h3>✅ Congratulations!</h3>
                <p style="font-size: 16px; margin: 10px 0;">
                    Your job posting has been <strong>APPROVED</strong> and is now live on Internship Hub!
                </p>
            </div>
            
            <p>Your job is now visible to thousands of talented students looking for opportunities. You'll start receiving applications soon!</p>
            
            <div class="job-details">
                <h3>📋 Job Details</h3>
                <p><strong>Position:</strong> {{ $job->title }}</p>
                <p><strong>Job Type:</strong> {{ ucfirst($job->job_type) }}</p>
                <p><strong>Work Mode:</strong> {{ ucfirst($job->work_mode) }}</p>
                <p><strong>Location:</strong> {{ $job->location }}</p>
                @if($job->budget_min && $job->budget_max)
                <p><strong>Budget:</strong> ৳{{ number_format($job->budget_min) }} - ৳{{ number_format($job->budget_max) }}</p>
                @elseif($job->hourly_rate)
                <p><strong>Hourly Rate:</strong> ৳{{ number_format($job->hourly_rate) }}/hour</p>
                @endif
                <p><strong>Posted on:</strong> {{ $job->created_at->format('F d, Y') }}</p>
            </div>
            
            <div class="tips">
                <h3>💡 Tips to Get Quality Applications</h3>
                <ul>
                    <li><strong>Respond Quickly:</strong> Reply to applications within 24 hours to show professionalism</li>
                    <li><strong>Be Clear:</strong> Provide detailed feedback when reviewing applications</li>
                    <li><strong>Stay Active:</strong> Update your job status regularly</li>
                    <li><strong>Engage Candidates:</strong> Ask relevant questions to assess skills</li>
                    <li><strong>Share Details:</strong> Be transparent about expectations and deliverables</li>
                </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
                <a href="{{ config('app.frontend_url') }}/jobs/{{ $job->job_id }}" class="button">
                    View Your Job Posting
                </a>
            </p>
            
            <p style="text-align: center; margin-top: 20px;">
                <a href="{{ config('app.frontend_url') }}/company/my-jobs" style="color: #667eea; text-decoration: none; font-size: 14px;">
                    Manage My Jobs →
                </a>
            </p>
            
            <div style="background: #fff9e6; padding: 15px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0; color: #856404;">
                    <strong>📧 Email Notifications:</strong> You'll receive email notifications when students apply to your job. Make sure to check your inbox regularly!
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} Internship Hub. All rights reserved.</p>
            <p>
                <a href="{{ config('app.frontend_url') }}" style="color: #10b981; text-decoration: none;">Visit Website</a> |
                <a href="{{ config('app.frontend_url') }}/company/post-job" style="color: #10b981; text-decoration: none;">Post Another Job</a> |
                <a href="{{ config('app.frontend_url') }}/contact" style="color: #10b981; text-decoration: none;">Contact Support</a>
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 10px;">
                Need help? Reply to this email or visit our support center.
            </p>
        </div>
    </div>
</body>
</html>