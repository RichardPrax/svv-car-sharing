const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase environment variables!");
    console.error("Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAuthUser(email, password, userData) {
    try {
        // Create new auth user (let Supabase generate the UID)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                firstName: userData.firstName,
                lastName: userData.lastName
            }
        });

        if (authError) {
            // Check if it's an "email already exists" error
            if (authError.message && authError.message.includes('already been registered')) {
                console.log(`✅ Auth user already exists for ${email}`);
                // Try to get the user by listing all users
                const { data: users, error: listError } = await supabase.auth.admin.listUsers();
                if (!listError && users.users) {
                    const existingUser = users.users.find(user => user.email === email);
                    if (existingUser) {
                        console.log(`✅ Found existing auth user for ${email}:`, existingUser.id);
                        return existingUser;
                    }
                }
                return null;
            } else {
                console.error(`❌ Error creating auth user for ${email}:`, authError);
                return null;
            }
        }

        console.log(`✅ Auth user created for ${email}:`, authData.user.id);
        return authData.user;
    } catch (error) {
        console.error(`❌ Error creating auth user for ${email}:`, error);
        return null;
    }
}

async function main() {
    console.log("🔐 Creating authentication users...");

    // Test users data (without predefined IDs)
    const testUsers = [
        {
            email: "max.mustermann@example.com",
            password: "test1234",
            firstName: "Max",
            lastName: "Mustermann"
        },
        {
            email: "anna.schmidt@example.com", 
            password: "test1234",
            firstName: "Anna",
            lastName: "Schmidt"
        }
    ];

    // Create auth users first, then database records
    for (const userData of testUsers) {
        console.log(`Creating auth user for ${userData.email}...`);
        
        const authUser = await createAuthUser(userData.email, userData.password, userData);
        
        if (authUser) {
            // Create database record using the auth user's UID
            try {
                const dbUser = await prisma.userProfile.upsert({
                    where: { id: authUser.id },
                    update: {
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                    },
                    create: {
                        id: authUser.id, // Use the auth user's UID as the database ID
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                    },
                });
                console.log(`✅ Database record created/updated for ${userData.email} with ID: ${authUser.id}`);
            } catch (dbError) {
                console.error(`❌ Error creating/updating database record for ${userData.email}:`, dbError);
            }
        }
    }

    console.log("🎉 Authentication users creation completed!");
    console.log("");
    console.log("📧 Test user credentials:");
    console.log("Email: max.mustermann@example.com, Password: test1234");
    console.log("Email: anna.schmidt@example.com, Password: test1234");
    console.log("");
    console.log("You can now log in with these credentials!");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 