const Footer = () => {
  return (
    <footer className="bg-[#D17850] text-black py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Navigation Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold">About Tasteplorer</h3>
          <a href="#" className="hover:underline">
            Blogs
          </a>
          <a href="#" className="hover:underline">
            Customer Care
          </a>
          <a href="#" className="hover:underline">
            Food Service
          </a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold">Email us</h3>
          <p>tasteplorer@gmail.com</p>
          <h3 className="text-lg font-semibold mt-4">Helpline no. or Call</h3>
          <p className="text-xl font-bold">+ 019 XXXXX XXXXX</p>
        </div>

        {/* Subscribe Section */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold">Get the new recipes</h3>
          <div className="flex border border-black rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your Email Here"
              className="p-2 w-full outline-none"
            />
            <button className="bg-black text-white px-4">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="max-w-6xl mx-auto mt-6 border-t border-black pt-4 flex flex-col lg:flex-row items-center justify-between">
        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a href="#" className="text-2xl">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="text-2xl">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#" className="text-2xl">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-2xl">
            <i className="fab fa-instagram"></i>
          </a>
        </div>

        {/* Legal Links */}
        <div className="text-sm mt-4 lg:mt-0">
          <a href="#" className="hover:underline">
            Terms & Conditions
          </a>{' '}
          |
          <a href="#" className="hover:underline">
            {' '}
            Privacy Policy
          </a>{' '}
          |<span> Copyright © 2025 Tasteplorer</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
