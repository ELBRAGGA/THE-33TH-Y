#include <iostream>
#include <vector>
#include <iomanip>
#include <string>
#include <sstream>
#include <cstdlib>
#include <thread>
#include <chrono>

using namespace std;

void clearScreen() {
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

void pauseConsole() {
    cout << "Press Enter to continue...";
    cin.ignore();
    cin.get();
}

struct Vinyl {
    string albumName;
    string artist;
    string genre;
    int year;
    string condition;
    string rarity;
    double price;
    int quantity;
};

class The33rdYStore {
private:
    vector<Vinyl> bluesRecords;
    vector<Vinyl> cart;
    double total;
    string customerName;

    void loadInventory();
    void browseByGenre();
    void browseByRarity();
    void addToCart();
    void showCart();
    void makePayment();
    void contactOwner();
    void goodbye();
    void displayLogo();

    double calculatePrice(const Vinyl& record);
    void displayRecordTable(const vector<Vinyl>& records);
    void addRecordToCart(const vector<Vinyl>& records);

public:
    The33rdYStore();
    void intro();
    void mainMenu();
};

The33rdYStore::The33rdYStore() : total(0) {
    loadInventory();
}

void The33rdYStore::displayLogo() {
    clearScreen();
    cout << "\n\n";
    cout << "========================================\n";
    cout << "           THE 33RD Y\n";
    cout << "      Premium Vinyl Experience\n";
    cout << "========================================\n\n";
    cout << "Welcome to The 33rd Y - Curated blues vinyl collections.\n";
    cout << "Rare pressings, mint condition classics, authentic blues heritage.\n";
    cout << "All prices are displayed in RMB.\n\n";

    cout << "Press Enter to enter the store.\n";
    cout << "Or type 'exit' to leave: ";

    string input;
    getline(cin, input);
    if (input == "exit") {
        goodbye();
    }
}

double The33rdYStore::calculatePrice(const Vinyl& record) {
    double basePrice = record.price;
    
    // Condition modifiers
    if (record.condition == "Mint") basePrice *= 2.5;
    else if (record.condition == "Near Mint") basePrice *= 2.0;
    else if (record.condition == "Very Good") basePrice *= 1.5;
    else if (record.condition == "Good") basePrice *= 1.2;
    
    // Rarity modifiers
    if (record.rarity == "Grail") basePrice *= 4.0;
    else if (record.rarity == "Rare") basePrice *= 2.5;
    else if (record.rarity == "Limited") basePrice *= 1.8;
    
    return basePrice;
}

void The33rdYStore::displayRecordTable(const vector<Vinyl>& records) {
    cout << left << setw(3) << "#" << setw(25) << "Album" 
         << setw(18) << "Artist" << setw(6) << "Year" 
         << setw(10) << "Condition" << setw(10) << "Rarity" 
         << setw(10) << "Price" << setw(5) << "Qty" << endl;
    cout << string(85, '-') << endl;

    for (size_t i = 0; i < records.size(); ++i) {
        double finalPrice = calculatePrice(records[i]);
        cout << left << setw(2) << i + 1 << ". " 
             << setw(23) << (records[i].albumName.length() > 22 ? 
                 records[i].albumName.substr(0, 20) + ".." : records[i].albumName)
             << setw(16) << (records[i].artist.length() > 15 ? 
                 records[i].artist.substr(0, 13) + ".." : records[i].artist)
             << setw(6) << records[i].year 
             << setw(10) << records[i].condition 
             << setw(10) << records[i].rarity 
             << "¥" << setw(8) << fixed << setprecision(0) << finalPrice 
             << setw(3) << records[i].quantity << endl;
    }
}

void The33rdYStore::addRecordToCart(const vector<Vinyl>& records) {
    cout << "\nEnter the number of the record you want to add to cart (0 to go back): ";
    int choice;
    cin >> choice;
    cin.ignore();

    if (choice == 0) return;
    if (choice < 1 || choice > (int)records.size()) {
        cout << "Invalid selection.\n";
        pauseConsole();
        return;
    }

    // Find the selected record in the main inventory
    Vinyl selected = records[choice - 1];
    bool found = false;
    int mainIndex = -1;
    
    // Find the record in the main inventory by matching details
    for (size_t i = 0; i < bluesRecords.size(); ++i) {
        if (bluesRecords[i].albumName == selected.albumName &&
            bluesRecords[i].artist == selected.artist &&
            bluesRecords[i].year == selected.year) {
            mainIndex = i;
            found = true;
            break;
        }
    }

    if (!found) {
        cout << "Error: Record not found in inventory.\n";
        pauseConsole();
        return;
    }

    Vinyl& chosen = bluesRecords[mainIndex];
    
    if (chosen.quantity <= 0) {
        cout << "Sorry, this record is out of stock.\n";
        pauseConsole();
        return;
    }

    double finalPrice = calculatePrice(chosen);
    total += finalPrice;
    
    // Add to cart
    cart.push_back(chosen);
    
    // Reduce quantity in inventory
    chosen.quantity--;
    
    cout << "\n🎵 " << chosen.albumName << " by " << chosen.artist << " added to your collection!\n";
    cout << "Price: ¥" << finalPrice << " (Condition: " << chosen.condition 
         << ", Rarity: " << chosen.rarity << ")\n";

    pauseConsole();
}

void The33rdYStore::loadInventory() {
    // Clear any existing records
    bluesRecords.clear();
    
    // Delta Blues
    bluesRecords.push_back({"King of the Delta Blues", "Robert Johnson", "Delta Blues", 1961, "Very Good", "Grail", 4500, 1});
    bluesRecords.push_back({"Complete Recordings", "Charley Patton", "Delta Blues", 1990, "Near Mint", "Rare", 3200, 3});
    
    // Chicago Electric Blues
    bluesRecords.push_back({"Born Under a Bad Sign", "Albert King", "Chicago Blues", 1967, "Good", "Rare", 2800, 1});
    bluesRecords.push_back({"Hard Again", "Muddy Waters", "Chicago Blues", 1977, "Near Mint", "Limited", 2200, 2});
    bluesRecords.push_back({"Live at the Regal", "B.B. King", "Chicago Blues", 1965, "Mint", "Grail", 6800, 1});
    
    // Texas Blues
    bluesRecords.push_back({"Texas Flood", "Stevie Ray Vaughan", "Texas Blues", 1983, "Near Mint", "Limited", 1800, 4});
    
    // Modern Blues
    bluesRecords.push_back({"From the Cradle", "Eric Clapton", "Chicago Blues", 1994, "Near Mint", "Common", 1200, 6});
    bluesRecords.push_back({"Blues Breakers", "John Mayall & Eric Clapton", "Chicago Blues", 1966, "Good", "Grail", 5200, 1});
}

void The33rdYStore::intro() {
    displayLogo();
    clearScreen();
    cout << "Welcome to The 33rd Y!\n";
    cout << "Please tell us your name: ";
    getline(cin, customerName);
    cout << "\nWonderful to have you here, " << customerName << "!\n";
    cout << "Let's find some authentic blues treasures for your collection.\n";
    cout << "\nPress Enter to continue...";
    cin.get();
    mainMenu();
}

void The33rdYStore::browseByGenre() {
    while (true) {
        clearScreen();
        cout << "Browse by Blues Genre:\n\n";
        cout << "1. Delta Blues\n";
        cout << "2. Chicago Blues\n";
        cout << "3. Texas Blues\n";
        cout << "4. All Genres\n";
        cout << "0. Back to Main Menu\n\n";
        cout << "Select genre: ";

        int choice;
        cin >> choice;
        cin.ignore();

        if (choice == 0) return;

        clearScreen();
        vector<string> genres = {"Delta Blues", "Chicago Blues", "Texas Blues"};
        string selectedGenre;

        if (choice >= 1 && choice <= 3) {
            selectedGenre = genres[choice - 1];
            cout << selectedGenre << " Collection:\n\n";
        } else if (choice == 4) {
            selectedGenre = "All";
            cout << "Complete Blues Collection:\n\n";
        } else {
            cout << "Invalid selection.\n";
            pauseConsole();
            continue;
        }

        vector<Vinyl> filteredRecords;
        for (const auto& record : bluesRecords) {
            if (selectedGenre == "All" || record.genre == selectedGenre) {
                filteredRecords.push_back(record);
            }
        }

        if (filteredRecords.empty()) {
            cout << "No records found in this genre.\n";
            pauseConsole();
            continue;
        }

        displayRecordTable(filteredRecords);
        
        cout << "\nOptions:\n";
        cout << "1. Add a record to collection\n";
        cout << "2. Browse different genre\n";
        cout << "0. Back to Main Menu\n";
        cout << "Select option: ";
        
        int option;
        cin >> option;
        cin.ignore();
        
        if (option == 1) {
            addRecordToCart(filteredRecords);
        } else if (option == 2) {
            continue;
        } else if (option == 0) {
            return;
        } else {
            cout << "Invalid option.\n";
            pauseConsole();
        }
    }
}

void The33rdYStore::browseByRarity() {
    while (true) {
        clearScreen();
        cout << "Collector's Corner - Browse by Rarity:\n\n";
        cout << "1. Grail (Ultra Rare Masterpieces)\n";
        cout << "2. Rare (Hard to Find Classics)\n";
        cout << "3. Limited (Numbered/Special Editions)\n";
        cout << "4. All Rarities\n";
        cout << "0. Back to Main Menu\n\n";
        cout << "Select rarity level: ";

        int choice;
        cin >> choice;
        cin.ignore();

        if (choice == 0) return;

        vector<string> rarities = {"Grail", "Rare", "Limited"};
        string selectedRarity;
        
        if (choice >= 1 && choice <= 3) {
            selectedRarity = rarities[choice - 1];
        } else if (choice == 4) {
            selectedRarity = "All";
        } else {
            cout << "Invalid selection.\n";
            pauseConsole();
            continue;
        }

        clearScreen();
        if (selectedRarity != "All") {
            cout << selectedRarity << " Blues Records:\n\n";
        } else {
            cout << "All Blues Records:\n\n";
        }
        
        vector<Vinyl> filteredRecords;
        for (const auto& record : bluesRecords) {
            if (selectedRarity == "All" || record.rarity == selectedRarity) {
                filteredRecords.push_back(record);
            }
        }

        if (filteredRecords.empty()) {
            cout << "No " << selectedRarity << " records available.\n";
            pauseConsole();
            continue;
        }

        displayRecordTable(filteredRecords);
        
        cout << "\nOptions:\n";
        cout << "1. Add a record to collection\n";
        cout << "2. Browse different rarity\n";
        cout << "0. Back to Main Menu\n";
        cout << "Select option: ";
        
        int option;
        cin >> option;
        cin.ignore();
        
        if (option == 1) {
            addRecordToCart(filteredRecords);
        } else if (option == 2) {
            continue;
        } else if (option == 0) {
            return;
        } else {
            cout << "Invalid option.\n";
            pauseConsole();
        }
    }
}

void The33rdYStore::addToCart() {
    clearScreen();
    cout << "Available Blues Records:\n\n";
    displayRecordTable(bluesRecords);
    addRecordToCart(bluesRecords);
}

void The33rdYStore::showCart() {
    clearScreen();
    cout << "Your Vinyl Collection:\n\n";
    
    if (cart.empty()) {
        cout << "Your collection is empty. Start collecting some blues treasures!\n";
    } else {
        cout << left << setw(25) << "Album" << setw(18) << "Artist" 
             << setw(10) << "Condition" << setw(10) << "Rarity" << "Price" << endl;
        cout << string(70, '-') << endl;
        
        for (size_t i = 0; i < cart.size(); ++i) {
            double price = calculatePrice(cart[i]);
            cout << left << setw(23) << (cart[i].albumName.length() > 22 ? 
                 cart[i].albumName.substr(0, 20) + ".." : cart[i].albumName)
                 << setw(16) << (cart[i].artist.length() > 15 ? 
                 cart[i].artist.substr(0, 13) + ".." : cart[i].artist)
                 << setw(10) << cart[i].condition 
                 << setw(10) << cart[i].rarity 
                 << "¥" << fixed << setprecision(0) << price << endl;
        }
        cout << string(70, '-') << endl;
        cout << "Total: ¥" << fixed << setprecision(0) << total << endl;
    }
    
    pauseConsole();
}

void The33rdYStore::makePayment() {
    if (total == 0) {
        clearScreen();
        cout << "Your collection is empty. Please add some vinyl treasures first!\n";
        pauseConsole();
        return;
    }

    clearScreen();
    cout << "🎵 Checkout - The 33rd Y 🎵\n\n";
    cout << "Your collection total: ¥" << fixed << setprecision(0) << total << endl;
    
    cout << "\nShipping Options:\n";
    cout << "1. Standard Shipping - ¥35 (5-7 days)\n";
    cout << "2. Collector's Shipping - ¥105 (2-3 days, insurance included)\n";
    cout << "3. International Shipping - ¥175 (7-14 days)\n";
    cout << "Select shipping method: ";
    
    int shipping;
    cin >> shipping;
    cin.ignore();
    
    double shippingCost = 0;
    string shippingMethod;
    
    switch (shipping) {
        case 1: shippingCost = 35; shippingMethod = "Standard"; break;
        case 2: shippingCost = 105; shippingMethod = "Collector's"; break;
        case 3: shippingCost = 175; shippingMethod = "International"; break;
        default: 
            cout << "Invalid selection. Using standard shipping.\n";
            shippingCost = 35; 
            shippingMethod = "Standard";
            break;
    }
    
    double finalTotal = total + shippingCost;
    
    cout << "\nPayment Summary:\n";
    cout << "Records Total: ¥" << total << endl;
    cout << "Shipping (" << shippingMethod << "): ¥" << shippingCost << endl;
    cout << "Final Total: ¥" << finalTotal << endl;
    
    cout << "\nSelect Payment Method:\n";
    cout << "1. WeChat Pay\n";
    cout << "2. Alipay\n";
    cout << "3. Bank Card (UnionPay)\n";
    cout << "4. Cash on Delivery\n";
    cout << "0. Cancel Order\n";
    cout << "Select payment method: ";
    
    int paymentMethod;
    cin >> paymentMethod;
    cin.ignore();
    
    vector<string> paymentMethods = {"WeChat Pay", "Alipay", "Bank Card (UnionPay)", "Cash on Delivery"};
    
    if (paymentMethod == 0) {
        cout << "\nOrder cancelled.\n";
        pauseConsole();
        return;
    }
    
    if (paymentMethod < 1 || paymentMethod > 4) {
        cout << "Invalid payment method. Using WeChat Pay.\n";
        paymentMethod = 1;
    }
    
    cout << "\nProceed with payment using " << paymentMethods[paymentMethod - 1] << "? (1 = Yes, 0 = Cancel): ";
    int confirm;
    cin >> confirm;
    cin.ignore();
    
    if (confirm == 1) {
        cout << "\nProcessing your payment...\n";
        this_thread::sleep_for(chrono::seconds(2));
        cout << "Payment Successful! Thank you, " << customerName << "!\n";
        cout << "Payment Method: " << paymentMethods[paymentMethod - 1] << endl;
        cout << "Amount Paid: ¥" << finalTotal << endl;
        cout << "Your blues collection will be carefully packaged and shipped.\n";
        
        // Clear cart and reset total
        cart.clear();
        total = 0;
    } else {
        cout << "\nPayment cancelled.\n";
    }
    
    pauseConsole();
}

void The33rdYStore::contactOwner() {
    clearScreen();
    cout << "Contact The 33rd Y:\n\n";
    cout << "For rare finds, appraisals, or collection advice:\n";
    cout << "Phone: +86-189-0542-8465\n";
    cout << "WeChat: Yahya AFFAN\n";
    cout << "Store Hours: 10:00 AM - 8:00 PM (Daily)\n";
    cout << "Address: 山东省青岛市黄岛区灵珠山街道\n\n";
    cout << "Specializing in authentic blues vinyl since 2019.\n";
    pauseConsole();
}

void The33rdYStore::goodbye() {
    clearScreen();
    cout << "Thank you for visiting The 33rd Y!\n";
    cout << "Keep spinning those blues and preserving musical heritage.\n";
    cout << "Come back soon for more authentic treasures!\n";
    exit(0);
}

void The33rdYStore::mainMenu() {
    while (true) {
        clearScreen();
        cout << "========================================\n";
        cout << "    Welcome, " << customerName << "!\n";
        cout << "          THE 33RD Y\n";
        cout << "========================================\n\n";
        cout << "1. Browse by Genre\n";
        cout << "2. Browse by Rarity (Collector's Corner)\n";
        cout << "3. Add Records to Collection\n";
        cout << "4. View My Collection\n";
        cout << "5. Checkout & Payment\n";
        cout << "6. Contact Store Owner\n";
        cout << "0. Exit\n\n";
        cout << "Select an option: ";

        int choice;
        cin >> choice;
        cin.ignore();

        switch (choice) {
        case 1: browseByGenre(); break;
        case 2: browseByRarity(); break;
        case 3: addToCart(); break;
        case 4: showCart(); break;
        case 5: makePayment(); break;
        case 6: contactOwner(); break;
        case 0: goodbye(); break;
        default:
            cout << "Invalid option. Try again.";
            pauseConsole();
            break;
        }
    }
}

int main() {
    The33rdYStore store;
    store.intro();
    return 0;
}