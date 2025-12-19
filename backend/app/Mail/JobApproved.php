<?php

namespace App\Mail;

use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class JobApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $job;

    public function __construct(Job $job)
    {
        $this->job = $job;
    }

    public function build()
    {
        return $this->subject('Your Job Has Been Approved')
                    ->view('emails.job-approved');
    }
}