const authorize = async () => {
    try {
        const response = await fetch('/v1/session-admin');
        if (!response.ok) {
            window.location.href = '/login-admin';
        }
    } catch (error) {
        window.location.href = '/login-admin';
    }
}