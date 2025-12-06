<?php
/**
 * Contact Form Submission Handler
 * Danganronpa Fan Hub
 */

// Set headers
header('Content-Type: text/html; charset=UTF-8');

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Sanitize and validate input
    $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $talent = isset($_POST['talent']) ? htmlspecialchars(trim($_POST['talent'])) : '';
    $character = isset($_POST['character']) ? htmlspecialchars($_POST['character']) : '';
    $rating = isset($_POST['rating']) ? intval($_POST['rating']) : 0;
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';
    
    // Validate required fields
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($character)) {
        $errors[] = "Please select a favorite character";
    }
    
    if ($rating < 1 || $rating > 5) {
        $errors[] = "Please provide a rating";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // If validation passes
    if (empty($errors)) {
        // In production, you would:
        // 1. Save to database
        // 2. Send email notification
        // 3. Log the submission
        
        // For demonstration, we'll just display a success message
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You — Danganronpa Fan Hub</title>
            <link rel="stylesheet" href="css/styles.css">
        </head>
        <body>
            <div class="form-container" style="margin-top: 5rem;">
                <div class="success-message" style="display: block;">
                    <h2>✓ Message Received!</h2>
                    <h3>Thank you, <?php echo $name; ?>!</h3>
                    <p>We received your message and will respond to <strong><?php echo $email; ?></strong> soon.</p>
                    <p>Your favorite character: <strong><?php echo ucfirst($character); ?></strong></p>
                    <p>Rating: <?php echo str_repeat('★', $rating) . str_repeat('☆', 5 - $rating); ?></p>
                    <p style="margin-top: 2rem;">
                        <a href="index.html" style="color: var(--pink); text-decoration: underline;">← Return to Home</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        <?php
        exit;
    } else {
        // Display errors
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error — Danganronpa Fan Hub</title>
            <link rel="stylesheet" href="css/styles.css">
        </head>
        <body>
            <div class="form-container" style="margin-top: 5rem;">
                <h2 style="color: #ff4444;">Validation Errors</h2>
                <ul style="color: var(--fg);">
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo $error; ?></li>
                    <?php endforeach; ?>
                </ul>
                <p style="margin-top: 2rem;">
                    <a href="contact.html" style="color: var(--pink); text-decoration: underline;">← Go Back</a>
                </p>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
    
} else {
    // Not a POST request, redirect to contact form
    header('Location: contact.html');
    exit;
}
?>
