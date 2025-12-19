<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:student,company',
            'phone' => 'required|string'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'],
            'is_verified' => 0
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth-token')->plainTextToken;
        $user->load(['student', 'company', 'admin']);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['student', 'company', 'admin']);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        // Validate basic user fields
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string',
            'profile_picture' => 'sometimes|string'
        ]);
        
        // Update User table
        $user->update($validated);
        
        // Update Student specific fields
        if ($user->role === 'student' && $user->student) {
            $studentData = $request->validate([
                'location' => 'sometimes|string|nullable',
                'date_of_birth' => 'sometimes|date|nullable',
                'bio' => 'sometimes|string|nullable',
                'skills' => 'sometimes|string|nullable',
                'education' => 'sometimes|string|nullable',
                'university' => 'sometimes|string|nullable',
                'major' => 'sometimes|string|nullable',
                'graduation_year' => 'sometimes|integer|nullable',
                'portfolio_url' => 'sometimes|url|nullable',
                'github_url' => 'sometimes|url|nullable',
                'linkedin_url' => 'sometimes|url|nullable'
            ]);
            
            $user->student->update($studentData);
        }
        
        // Update Company specific fields
        if ($user->role === 'company' && $user->company) {
            $companyData = $request->validate([
                'company_name' => 'sometimes|string|max:255',
                'company_size' => 'sometimes|string|nullable',
                'industry' => 'sometimes|string|nullable',
                'location' => 'sometimes|string|nullable',
                'founded_year' => 'sometimes|integer|nullable',
                'description' => 'sometimes|string|nullable',
                'website' => 'sometimes|url|nullable',
                'address' => 'sometimes|string|nullable',
                'linkedin_url' => 'sometimes|url|nullable',
                'facebook_url' => 'sometimes|url|nullable',
                'twitter_url' => 'sometimes|url|nullable'
            ]);
            
            $user->company->update($companyData);
        }
        
        // Reload relationships
        $user->load(['student', 'company', 'admin']);
        
        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect'
            ], 400);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    }
}